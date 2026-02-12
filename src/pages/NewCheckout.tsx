import React, { useState, useContext, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, Palette, CreditCard, BadgeDollarSign, Wallet, Upload, Globe, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { checkoutService } from '../services/checkoutService.ts';

const paymentMethods = [
  { id: 'pix', name: 'PIX', icon: BadgeDollarSign }
];

export default function NewCheckout() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [checkoutName, setCheckoutName] = useState('');
  const [slug, setSlug] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [buttonColor, setButtonColor] = useState('#9333EA'); // Default purple
  const [successUrl, setSuccessUrl] = useState('');
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [products, setProducts] = useState<{
    metrics: {
      totalProducts: number;
      totalRevenue: string;
      totalSales: number;
      conversionRate: string;
    };
    products: any[];
  }>({ metrics: { totalProducts: 0, totalRevenue: '', totalSales: 0, conversionRate: '' }, products: [] });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await checkoutService.getUserProductSales();
        setProducts(data);
      } catch (error) {
        toast.error('Erro ao carregar os produtos');
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    if (!selectedProduct || !checkoutName || !slug) {
      return toast.error('Preencha todos os campos obrigatórios.');
    }

    try {
      const formData = new FormData();

      formData.append('product_id', String(selectedProduct));
      formData.append('name', checkoutName);
      formData.append('slug', slug);
      formData.append('methods', JSON.stringify(selectedMethods));
      formData.append('thankyou_redirect_url', successUrl || '');
      formData.append('type', 'checkout');
      if (bannerImage) formData.append('image', bannerImage);
      if (logoImage) formData.append('imageLogo', logoImage);

      await checkoutService.createCheckout(formData);

      toast.success('Checkout criado com sucesso!');
      navigate('/checkouts');
    } catch (error) {
      toast.error('Erro ao criar checkout.');
      console.error(error);
    }
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoImage(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const togglePaymentMethod = (methodId: string) => {
    setSelectedMethods(prev => 
      prev.includes(methodId)
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSlugChange = (value: string) => {
    const sanitizedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(sanitizedSlug);
  };
  
  return (
    <>
      <header className={`sticky top-0 z-20 ${isDarkMode ? 'bg-[#0B0B14]' : 'bg-gray-50'} px-4 lg:px-8 py-4`}>
        <div className="flex items-center gap-4">
          <Link to="/checkouts" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Novo Checkout</h1>
            <p className="text-sm text-gray-400">Crie um novo checkout personalizado</p>
          </div>
        </div>
      </header> 

      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className={`${isDarkMode ? 'bg-[#12121E] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 space-y-6 border`}>
            <div className="space-y-6">
              {/* Product Selection */}
              <div>
                <h2 className="text-lg font-medium mb-4">Selecione o produto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product.id);
                        setCustomPrice(product.price);
                      }}
                      className={`
                        p-4 rounded-lg border-2 flex items-center gap-4
                        ${selectedProduct === product.id 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : `${isDarkMode ? 'border-[#1E1E2E] hover:border-purple-500/50' : 'border-gray-200 hover:border-purple-500/50'}`}
                        transition-colors
                      `}
                    >
                      <img src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-400">R$ {product.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedProduct && (
                <>
                  <div className={`h-px ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-200'}`} />
                  
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium mb-4">Informações básicas</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-400">Nome do checkout</span>
                        <input
                          type="text"
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                          placeholder="Ex: Checkout Padrão"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium text-gray-400">URL personalizada</span>
                        <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-purple-500 px-3`}>
                          <Globe size={16} className="text-gray-400" />
                          <input
                            type="text"
                            value={slug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                            placeholder="url-amigavel"
                          />
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className={`h-px ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-200'}`} />

                  {/* Payment Methods */}
                  <div>
                    <h2 className="text-lg font-medium mb-4">Métodos de pagamento</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => togglePaymentMethod(method.id)}
                          className={`
                            p-4 rounded-lg border-2 flex items-center gap-3
                            ${selectedMethods.includes(method.id)
                              ? 'border-purple-500 bg-purple-500/10' 
                              : `${isDarkMode ? 'border-[#1E1E2E] hover:border-purple-500/50' : 'border-gray-200 hover:border-purple-500/50'}`}
                            transition-colors
                          `}
                        >
                          <method.icon size={20} />
                          <span className="text-sm font-medium">{method.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`h-px ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-200'}`} />

                  {/* Logo Image */}
                  <div>
                    <h2 className="text-lg font-medium mb-4">Logo do header do checkout</h2>
                    {logoPreview ? (
                      <div className="relative">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setLogoImage(null);
                            setLogoPreview(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    ) : (
                      <label className={`
                        flex flex-col items-center justify-center w-full h-48 rounded-lg cursor-pointer
                        border-2 border-dashed transition-colors
                        ${isDarkMode 
                          ? 'border-white/5 hover:border-purple-500/50 bg-[#1E1E2E]' 
                          : 'border-gray-200 hover:border-purple-500/50 bg-gray-50'}
                      `}>
                        <Upload className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-400">Upload da Logo</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </label>
                    )}
                  </div>

                  {/* Banner Image */}
                  <div>
                    <h2 className="text-lg font-medium mb-4">Banner do checkout</h2>
                    {bannerPreview ? (
                      <div className="relative">
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setBannerImage(null);
                            setBannerPreview(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    ) : (
                      <label className={`
                        flex flex-col items-center justify-center w-full h-48 rounded-lg cursor-pointer
                        border-2 border-dashed transition-colors
                        ${isDarkMode 
                          ? 'border-white/5 hover:border-purple-500/50 bg-[#1E1E2E]' 
                          : 'border-gray-200 hover:border-purple-500/50 bg-gray-50'}
                      `}>
                        <Upload className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-400">Upload do banner</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleBannerUpload}
                        />
                      </label>
                    )}
                  </div>

                  <div className={`h-px ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-200'}`} />

                  {/* Success Page */}
                  <div>
                    <h2 className="text-lg font-medium mb-4">Página de sucesso</h2>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-400">URL de redirecionamento (opcional)</span>
                      <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-purple-500 px-3`}>
                        <LinkIcon size={16} className="text-gray-400" />
                        <input
                          type="url"
                          value={successUrl}
                          onChange={(e) => setSuccessUrl(e.target.value)}
                          className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                          placeholder="https://"
                        />
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className={`pt-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
              <button 
                onClick={handleSubmit}
                className={`
                  w-full py-2 px-4 rounded-lg font-medium transition-colors
                  ${selectedProduct && selectedMethods.length > 0 && checkoutName && slug
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : `${isDarkMode ? 'bg-[#1E1E2E] text-gray-400' : 'bg-gray-100 text-gray-400'}`}
                `}
                disabled={!selectedProduct || selectedMethods.length === 0 || !checkoutName || !slug}
              >
                Criar checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}