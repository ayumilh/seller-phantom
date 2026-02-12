import React, { useEffect, useRef, useState } from 'react';
import { redirect, useParams } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode';
import { ShoppingCart, User, CreditCard, Lock, Minus, Plus, Package, MapPin, Phone, Mail, Check } from 'lucide-react';
import { depositService } from '../services/depositService';

interface Product {
  id: number;
  user_id: number;
  name: string;
  type: string;
  price: string;
  description: string | null;
  stock: number;
  weight: string;
  length: string;
  width: string;
  height: string;
  image: string;
  created_at: string;
  updated_at: string;
}

interface CheckoutData {
  id: number;
  slug: string;
  user_id: number;
  checkout_type: string;
  domain: string | null;
  product_id: number;
  shipping_id: string | null;
  theme: string;
  header_logo: string | null;
  header_bg_color: string | null;
  header_text_color: string | null;
  body_bg_color: string | null;
  body_bg_image: string | null;
  body_text_color: string | null;
  footer_bg_color: string | null;
  footer_text_color: string | null;
  banner_image_1: string | null;
  banner_image_2: string | null;
  banner_image_3: string | null;
  custom_css: string | null;
  webhook_url: string | null;
  thankyou_redirect_url: string | null;
  created_at: string;
  updated_at: string;
  product: Product;
}

interface FormData {
  // Dados pessoais
  name: string;
  email: string;
  phone: string;
  // Endereço
  zipCode: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  // Pagamento
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  document: string;
  coupon: string;
  installments: string;
  orderId: number;
}

export default function CheckoutView() {
  const { slug } = useParams();
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQrCode, setLoadingQrCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [hasSent, setHasSent] = useState(false);
  const statusIntervalRef = useRef(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    document: '',
    coupon: '',
    installments: '1',
    orderId: 0
  });

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/checkout/checkout/${slug}`);
        setCheckout(res.data);
      } catch (err) {
        console.error('Erro ao carregar checkout:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCheckout();
  }, [slug]);

  useEffect(() => {
    const fetchOrder = async () => {
      const { name, phone, email, document } = formData

      const allFilled =
        name.trim() !== '' &&
        phone.trim() !== '' &&
        email.trim() !== '' &&
        document.trim() !== '';

      const payload = {
        checkout_id: checkout?.id,
        user_id: checkout?.user_id,
        product_id: checkout?.product_id,
        customer_name: name,
        customer_email: email,
        customer_document: document,
        amount: checkout?.product.price
      };

      if (allFilled && !hasSent) {
        try {
          const data = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/checkout/checkout/create-order`, payload);
          handleInputChange('orderId', data?.data.id || 0);
          setHasSent(true);
        } catch (err) {
          console.error('Erro ao carregar checkout:', err);
        }
      }
    };

    fetchOrder();
  }, [formData, hasSent])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const gerarQrCode = async () => {
    console.log('Chamou');
    setLoadingQrCode(true);
    setCopied(false);

    const payload = {
      orderId: formData.orderId
    };

    if (formData.orderId) {
      try {
        const data = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/checkout/checkout/create-payment`, payload);
        const qrImage = await QRCode.toDataURL(data.data.qrCodeResponse.qrcode);
        setQrCodeImage(qrImage);
        setQrCodeUrl(data.data.qrCodeResponse.qrcode);
        startPollingStatus(data.data.qrCodeResponse.transactionId);
      } catch (err) {
        console.error('Erro ao carregar checkout:', err);
      }
    }
    setLoadingQrCode(false);
  };

  const startPollingStatus = (transactionId: any) => {
    console.log(transactionId);
    if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);

    statusIntervalRef.current = setInterval(async () => {
      try {
        const response = await depositService.getStatusDeposit(transactionId);
        if (response.status === "COMPLETED") {
          console.log('Redirecionando...');
          window.location.href = '/checkout/thank-you';
        }
      } catch (error) {
        console.error('Erro ao buscar status do depósito:', error);
      }
    }, 5000);
  };

  const copiarPix = async () => {
    if (qrCodeUrl) {
      try {
        await navigator.clipboard.writeText(qrCodeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Erro ao copiar PIX:', err);
      }
    }
  }

  const handleQuantityChange = (delta: number) => {
    if (!checkout?.product) return;
    setQuantity(prev => Math.max(1, Math.min(checkout.product.stock, prev + delta)));
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numPrice);
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando checkout...</p>
      </div>
    </div>
  );

  if (!checkout) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Checkout não encontrado</h2>
        <p className="text-gray-600">Verifique se o link está correto</p>
      </div>
    </div>
  );

  const total = parseFloat(checkout.product.price) * quantity;
  const shipping = checkout.product.type === 'physical' ? 0 : 0;
  const finalTotal = total + shipping;

  // Cores padrão caso não estejam definidas na API
  const headerBgColor = checkout.header_bg_color || '#FFFFFF';
  const headerTextColor = checkout.header_text_color || '#1E293B';
  const bodyBgColor = checkout.body_bg_color || '#F8FAFC';
  const bodyTextColor = checkout.body_text_color || '#1E293B';
  const footerBgColor = checkout.footer_bg_color || '#1E293B';
  const footerTextColor = checkout.footer_text_color || '#FFFFFF';

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundColor: bodyBgColor,
        backgroundImage: checkout.body_bg_image ? `url(${getImageUrl(checkout.body_bg_image)})` : undefined,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        color: bodyTextColor
      }}
    >
      {/* Header */}
      <header
        className="w-full border-b border-gray-100"
        style={{ backgroundColor: headerBgColor, color: headerTextColor }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            {checkout.header_logo && (
              <img src={getImageUrl(checkout.header_logo)} alt="Logo" className="h-8 w-auto" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <img src="https://flagcdn.com/w20/br.png" alt="Brasil" className="w-5 h-auto" />
            <span className="text-sm">🔒</span>
          </div>
        </div>
      </header>

      {/* Banner */}
      {checkout.banner_image_1 && (
        <div className="w-full h-32 sm:h-48 lg:h-64 overflow-hidden">
          <img
            src={getImageUrl(checkout.banner_image_1)}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <main className="w-[84%] ml-[8%] bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Left Column - Checkout Form */}
            <div className="bg-white rounded-lg p-6 sm:p-8 lg:p-10 h-fit">
              
              {/* Informações Pessoais */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações pessoais</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={`${formData.name}`.trim()}
                    onChange={(e) => {
                      handleInputChange('name', e.target.value || '');
                    }}
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  />
                  <div className="flex">
                    <div className="flex items-center px-4 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      <img src="https://flagcdn.com/w20/br.png" alt="Brasil" className="w-4 h-auto mr-2" />
                      <span className="text-sm">+55</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Telefone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="flex-1 px-4 py-3 sm:py-4 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    />
                  </div>
                  <div className="mb-8">
                    <input
                      type="text"
                      placeholder="CPF/CNPJ"
                      value={formData.document}
                      onChange={(e) => handleInputChange('document', e.target.value)}
                      className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>              

              {/* Endereço de Entrega - apenas para produtos físicos */}
              {checkout.product.type === 'physical' && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Endereço de entrega</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="CEP"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Endereço"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="sm:col-span-2 px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <input
                        type="text"
                        placeholder="Número"
                        value={formData.number}
                        onChange={(e) => handleInputChange('number', e.target.value)}
                        className="px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Complemento"
                        value={formData.complement}
                        onChange={(e) => handleInputChange('complement', e.target.value)}
                        className="px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={formData.neighborhood}
                        onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                        className="sm:col-span-2 px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="sm:col-span-2 px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      />
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      >
                        <option value="">Estado</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="PR">Paraná</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="BA">Bahia</option>
                        <option value="GO">Goiás</option>
                        <option value="PE">Pernambuco</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PI">Piauí</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                        <option value="AL">Alagoas</option>
                        <option value="AM">Amazonas</option>
                        <option value="AP">Amapá</option>
                        <option value="AC">Acre</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Escolha uma opção */}
              <div className="mb-8">
                
                <div className="grid grid-cols-2 sm:gap-6 mb-8 sm:mb-10">
                  {/* PIX Button */}
                  <button
                    className={`p-4 sm:p-6 rounded-lg border-2 text-center transition-all ${
                      paymentMethod === 'pix' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-20 h-20 mx-auto mb-2 bg-teal-600 rounded text-white flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" width="50px" height="50px" viewBox="0 0 16 16">
                        <path d="M11.917 11.71a2.046 2.046 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.044 2.044 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668h-.253zM4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.044 2.044 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z"/>
                        <path d="m14.377 6.496-1.612-1.612a.307.307 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.448 1.448 0 0 0-1.018-.422h-.9a.306.306 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.305.305 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733c.04 0 .079.01.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z"/>
                      </svg>
                    </div>
                  </button>

                  {/* QR CODE ou Loading */}
                  <div className="flex items-center justify-center">
                    {loadingQrCode ? (
                      <div className="text-gray-500 animate-pulse text-sm">Carregando QR Code...</div>
                    ) : qrCodeUrl ? (
                      <img src={qrCodeImage} alt="QR Code Pix" className="w-40 h-40 object-contain" />
                    ) : (
                      <svg
                        className="svg-inline--fa fa-qrcode"
                        aria-hidden="true"
                        data-prefix="fal"
                        data-icon="qrcode"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        style={{
                          color: 'var(--gray-300)',
                          fontSize: '1.25rem',
                          width: '160px',
                          height: '160px',
                        }}
                      >
                        <path
                          fill="currentColor"
                          d="M144 64H48c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16zM48 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80C0 53.5 21.5 32 48 32zm96 288H48c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16V336c0-8.8-7.2-16-16-16zM48 288h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336c0-26.5 21.5-48 48-48zM304 64c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H304zM256 80c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80zm0 224c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16v68h64V304c0-8.8 7.2-16 16-16s16 7.2 16 16v84c0 8.8-7.2 16-16 16H336c-8.8 0-16-7.2-16-16V320H288V472c0 8.8-7.2 16-16 16s-16-7.2-16-16V304z"
                        ></path>
                      </svg>
                    )}
                  </div>
                </div>

              </div>

              {/* Dados do Cartão (se cartão selecionado) */}
              {paymentMethod === 'credit' && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Dados do cartão</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="1234 1234 1234 1234"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent pr-20"
                      />
                      <div className="absolute right-3 top-3 sm:top-4 flex space-x-1">
                        <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                        <div className="w-6 h-4 bg-[var(--primary-color)] rounded-sm"></div>
                        <div className="w-6 h-4 bg-yellow-500 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={formData.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                        className="px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      />
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="CVV"
                          value={formData.cardCvv}
                          onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                          className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                        />
                        <span className="absolute right-3 top-3 sm:top-4 text-gray-400">?</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Titular do cartão */}
              {paymentMethod === 'credit' && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Titular do cartão</h3>
                  <input
                    type="text"
                    placeholder="Nome como no cartão"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  />
                </div>
              )}

              {/* Parcelamento */}
              {paymentMethod === 'credit' && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Parcelamento</h3>
                  <select
                    value={formData.installments}
                    onChange={(e) => handleInputChange('installments', e.target.value)}
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  >
                    <option value="1">1x {formatPrice(finalTotal)} (à vista)</option>
                    <option value="2">2x {formatPrice(finalTotal / 2)}</option>
                    <option value="3">3x {formatPrice(finalTotal / 3)}</option>
                    <option value="4">4x {formatPrice(finalTotal / 4)}</option>
                    <option value="6">6x {formatPrice(finalTotal / 6)}</option>
                    <option value="12">12x {formatPrice(finalTotal / 12)}</option>
                  </select>
                </div>
              )}

              {/* Botão continuar */}
              {loadingQrCode ? (
                <button
                  className="w-full p-2 rounded bg-gray-300 text-gray-600 cursor-wait"
                  disabled
                >
                  Gerando QR Code...
                </button>
              ) : qrCodeUrl ? (
                <button
                  onClick={copiarPix}
                  className="w-full p-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                >
                  {copied ? 'Copiado!' : 'Copiar Pix Copia e Cola'}
                </button>
              ) : (
                <button
                  onClick={gerarQrCode}
                  disabled={!formData.document}
                  className={`w-full p-2 rounded transition 
                    ${formData.document ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-300 text-white/70'}
                  `}
                >
                  Gerar QR Code
                </button>
              )}

              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Ao clicar em "Comprar", você concorda com a cobrança única conforme os detalhes informados.
              </p>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-gray-100 rounded-lg p-6 sm:p-8 sticky top-8">
                <div className="flex items-center mb-6">
                  <ShoppingCart className="w-6 h-6 text-[var(--primary-color)] mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Detalhes da compra</h3>
                </div>

                {/* Product */}
                <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base sm:text-lg">{checkout.product.name}</h4>
                    </div>
                    <span className="font-semibold text-base sm:text-lg">{formatPrice(checkout.product.price)}</span>
                  </div>

                  {/* Product Images */}
                  <div className="flex gap-3 mb-6 overflow-x-auto justify-center">
                    {checkout.product.image && (
                      <>
                        <img 
                          src={getImageUrl(checkout.product.image)} 
                          alt={checkout.product.name}
                          className="w-28 sm:w-32 h-28 sm:h-32 object-cover rounded-lg border flex-shrink-0"
                        />
                      </>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border rounded-lg">
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 sm:p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 sm:px-6 py-2 sm:py-3 font-medium">{quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 sm:p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={quantity >= checkout.product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span className="font-semibold">{formatPrice(shipping)}</span>
                  </div>

                  <hr className="border-gray-300" />

                  <div className="flex justify-between text-lg sm:text-xl">
                    <span className="font-bold text-gray-900">Total a pagar</span>
                    <span className="font-bold text-gray-900">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-6 sm:py-8 text-center border-t bg-gray-100 "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            <img loading="lazy" alt="billet" width="39" height="26" src="https://icons.yampi.me/svg/card-billet.svg" />
            <img loading="lazy" alt="amex" width="39" height="26" src="https://icons.yampi.me/svg/card-amex.svg" />
            <img loading="lazy" alt="visa" width="39" height="26" src="https://icons.yampi.me/svg/card-visa.svg" />
            <img loading="lazy" alt="diners" width="39" height="26" src="https://icons.yampi.me/svg/card-diners.svg" />
            <img loading="lazy" alt="mastercard" width="39" height="26" src="https://icons.yampi.me/svg/card-mastercard.svg" />
            <img loading="lazy" alt="hipercard" width="39" height="26" src="https://icons.yampi.me/svg/card-hipercard.svg" />
            <img loading="lazy" alt="elo" width="39" height="26" src="https://icons.yampi.me/svg/card-elo.svg" />
            <img loading="lazy" alt="hiper" width="39" height="26" src="https://icons.yampi.me/svg/card-hiper.svg" />
            <img loading="lazy" alt="pix" width="39" height="26" src="https://icons.yampi.me/svg/card-pix.svg" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ©️ {new Date().getFullYear()} Checkout. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}