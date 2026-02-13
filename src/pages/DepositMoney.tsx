import React, { useContext, useEffect, useState, useRef } from 'react';
import { ArrowLeft, Copy, CheckCircle2, QrCode, CreditCard, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import { depositService } from '../services/depositService';
import { utilsservice } from '../services/utilsService';
import QRCode from 'qrcode';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';
import { Loading } from '../components/Loading';
const paymentMethods = [
  {
    id: 'pix',
    name: 'PIX',
    icon: QrCode,
    description: 'Transferência instantânea',
    recommended: true
  },
];

export default function DepositMoney({ embedded = false }: { embedded?: boolean }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedMethod, setSelectedMethod] = useState('pix');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [codePix, setCodePix] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [depositStatus, setDepositStatus] = useState(null);
  const statusIntervalRef = useRef(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingInit(true);
        const balanceUser = await depositService.getBalanceUser();
        setBalance(balanceUser.balance);
      } catch (err) {
        console.error('Erro ao buscar saldo:', err);
        
        //alterar if depois de padronizar
        const error = err as { response?: { data?: { message?: string, erro?: string, error?: string } } };
        const errorMessage = error?.response?.data?.message || 
                            error?.response?.data?.erro || 
                            error?.response?.data?.error ||
                            "Tivemos um erro ao carregar seu saldo. Espere um pouco!";
        
        toast.error(errorMessage);
      }
      finally {
        setLoadingInit(false);
      }
    };
    fetchData();
  }, []);
  
  const startPollingStatus = (transactionId) => {
    console.log(transactionId);
    if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);

    statusIntervalRef.current = setInterval(async () => {
      try {
        const response = await depositService.getStatusDeposit(transactionId);
        if (response.status === "COMPLETED") {
          setDepositStatus("COMPLETED");
          clearInterval(statusIntervalRef.current);
        }
      } catch (error) {
        console.error('Erro ao buscar status do depósito:', error);
      }
    }, 5000);
  };

  const handleGenerateQrCode = async () => {
    try {
      setLoading(true);
      const external_id = `dep_${Date.now()}`;
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const payload = {
        amount,
        external_id,
        clientCallbackUrl: `${apiBase}/callback/pagloop`,
        payer: {
          name: 'Usuário do Gateway',
          email: 'email@gateway.com',
          document: '606.030.590-31'
        }
      };
      if (amount === ''){
        toast.error("Digite um valor para realizar depósito.");
      }
      else if(amount === '0'){
        return toast.error("Digite um valor maior que 0 para depositar.");
      }
     else {
       const result = await depositService.gerarQRCode(payload);
       const pixCode = result.qrCodeResponse.qrcode;
       const qrImage = await QRCode.toDataURL(pixCode);
       setQrCode(qrImage);
       setCodePix(pixCode);

      // Inicia o polling para o status do depósito após gerar QR Code
      startPollingStatus(result.qrCodeResponse.transactionId);
     }
    } catch (err) {
      //alterar if depois de padronizar
      const error = err as { response?: { data?: { message?: string, erro?: string, error?: string } } };
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.erro || 
                          error?.response?.data?.error ||
                          "Tivemos um problema ao gerar seu QR Code. Tente novamente!";
      
      toast.error(errorMessage);
      console.error('Erro ao gerar QR Code:', err);
    } finally {
      setLoading(false);
    }
  };

  // Limpar intervalo ao desmontar componente
  useEffect(() => {
    return () => {
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(codePix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

if (loadingInit) {
    return (
      <Loading/>
    );
  }

  // Se depósito concluído, mostrar mensagem de sucesso
  if (depositStatus === "COMPLETED") {
    return (
      <>
        {!embedded && (
          <header className={`sticky top-0 z-20 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} px-4 lg:px-8 py-4`}>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Depósito concluído</h1>
                <p className="text-sm text-gray-400">Seu depósito foi concluído com sucesso.</p>
              </div>
            </div>
          </header>
        )}

        <div className={`p-4 lg:p-8 ${embedded ? 'pt-0' : ''}`}>
          <div className="max-w-2xl mx-auto">
            <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 border flex flex-col items-center space-y-4`}>
              <CheckCircle2 size={64} className="text-green-500" />
              <p className="text-lg font-semibold text-green-600">Seu depósito foi concluído com sucesso!</p>
              <p className="text-gray-400 text-center">O valor já está disponível em sua conta.</p>
              <Link
                to="/"
                className="mt-4 inline-block bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {!embedded && (
        <header className={`sticky top-0 z-20 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} px-4 lg:px-8 py-4`}>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Depositar</h1>
              <p className="text-sm text-gray-400">Adicione saldo à sua conta</p>
            </div>
          </div>
        </header>
      )}

      <div className="p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 border space-y-6`}>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader className="animate-spin text-[var(--primary-color)] mb-4" size={40} />
                <p className="text-gray-400">Gerando QR Code, aguarde...</p>
              </div>
            ) : !qrCode ? (
              <>
                <div className={`p-4 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-50'} rounded-lg`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Saldo atual</span>
                    <span className="text-lg font-bold">{utilsservice.formatarParaReal(Number(balance))}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-400">Valor do depósito</span>
                    <div className="mt-1 relative">
                     
                  <NumericFormat
                    value={amount}
                     onValueChange={(values) => setAmount(values.value)}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={0}
                    suffix=',00'
                   fixedDecimalScale
                   allowNegative={false}
                   className={`w-full h-12 rounded-lg border-2 focus:ring-0 text-base px-4 ${
                   isDarkMode
                   ? 'bg-[var(--card-background)] border-white/10'
                   : 'bg-white text-black border-gray-200'
                     } transition-colors`}
                  placeholder="0,00"
                  required
                  inputMode="numeric"
                  />

                    </div>
                  </label>

                  <div>
                    <span className="text-sm font-medium text-gray-400 block mb-2">Método de pagamento</span>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-colors ${
                            selectedMethod === method.id
                              ? 'border-[var(--primary-color)] bg-[var(--primary-light)]'
                              : `${isDarkMode ? 'border-[var(--card-background)] hover:border-[var(--primary-color)]/50' : 'border-gray-200 hover:border-[var(--primary-color)]/50'}`
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${selectedMethod === method.id ? 'bg-[var(--primary-color)]' : 'bg-gray-500/10'}`}>
                            <method.icon size={20} className={selectedMethod === method.id ? 'text-white' : 'text-gray-400'} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{method.name}</p>
                              {method.recommended && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                                  Recomendado
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{method.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--primary-color)]/10 rounded-lg border border-[var(--primary-color)]/20">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="text-[var(--primary-color)] mt-0.5" size={16} />
                      <div>
                        <p className="text-sm text-[var(--primary-color)]">Depósito instantâneo</p>
                        <p className="text-xs text-gray-400">O dinheiro cairá na sua conta em até 1 minuto após a confirmação</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`pt-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                  <button
                    onClick={handleGenerateQrCode}
                    className="w-full bg-[var(--primary-color)] text-white h-12 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors font-medium"
                  >
                    Continuar
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4 text-center pt-6 border-t border-gray-200 px-4 max-w-full w-full overflow-hidden">
                <img
                  src={qrCode}
                  alt="QR Code PIX"
                  className="w-48 sm:w-56 max-w-full mx-auto"
                />
                <p className="text-sm text-gray-400 px-2">
                  Escaneie o QR Code com seu app bancário ou copie o código abaixo:
                </p>

                <div className="bg-gray-100 rounded-lg p-4 text-left overflow-hidden">
                  <div className="w-full overflow-x-auto">
                    <code className="block text-sm text-black whitespace-pre-wrap break-all max-w-full">
                      {codePix}
                    </code>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={handleCopy}
                      className="text-[var(--primary-color)] hover:text-[var(--primary-color)]/80"
                    >
                      <Copy size={18} />
                    </button>
                  </div>

                  {copied && (
                    <p className="text-xs text-green-500 mt-2 text-right">Código copiado!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
