import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import { withdrawService } from '../services/withdrawService';
import { utilsservice } from '../services/utilsService';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';
import { Loading } from '../components/Loading';
export default function WithdrawMoney({ embedded = false }: { embedded?: boolean }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [pixRawValue, setPixRawValue] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState('indefinido');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingInit(true);
        const balanceUser = await withdrawService.getBalanceUser();
        setBalance(balanceUser.balance);
      } catch (error) {
        console.error('Erro ao buscar saldo:', error);
      }
      finally {
        setLoadingInit(false);
      }
    };
    fetchData();
  }, []);

  const isValidCPF = (cpf: string) => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i);
    let rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(clean[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;

    return rest === parseInt(clean[10]);
  };

  function detectedTypeValuePixRawValue(value: string): string {
  const cleanValueRaw = value.replace(/\D/g, '');

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email';
  if(cleanValueRaw.length > 14) return 'Chave Pix Aleatória';
  if (cleanValueRaw.length === 14) return 'CNPJ';
  if (cleanValueRaw.length === 11) return isValidCPF(cleanValueRaw) ? 'CPF' : 'Telefone';

  return 'Indefinido';
}

function maskTypeValuePixRawValue(value: string, type: string): string {
  const cleanValueRaw = value.replace(/\D/g, '');
  switch (type) {
    case 'CPF':
      return cleanValueRaw.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    case 'CNPJ':
      return cleanValueRaw.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    case 'Telefone':
      return cleanValueRaw.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    case 'Email':
    default:
      return value;
  }
}
const handleChangePixRawValue = (e: React.ChangeEvent<HTMLInputElement>) => {
  const rawValue = e.target.value;
  const cleanValueRaw = rawValue.replace(/\D/g, '');
  const probable = detectedTypeValuePixRawValue(rawValue);
  if (
    (probable === 'CNPJ' && cleanValueRaw.length > 14) ||
    (probable === 'CPF' && cleanValueRaw.length > 11) ||
    (probable === 'Telefone' && cleanValueRaw.length > 11)
  ) {
    return;
  }
  const masked = maskTypeValuePixRawValue(rawValue, probable);
  setPixRawValue(masked);
  setType(probable);
};

const handleWithdraw = async () => {
    const amountNumber = parseFloat(amount.replace(',', '.'));
    const balanceNumber = parseFloat(balance);

    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Por favor, insira um valor válido para o saque.');
      return;
    }
    if(type === 'Indefinido'){
      toast.error("Defina uma chave para solicitar saque.")
    }
    if (amountNumber > balanceNumber) {
      toast.error('O valor do saque não pode ser maior que o saldo disponível.');
      return;
    }

    if (!pixRawValue) {
      toast.error('Por favor, insira uma chave PIX válida.');
      return;
    }
    const pixNoSymbolsRaw = type === 'Chave Pix Aleatória' || type === 'Email' ? pixRawValue : pixRawValue.replace(/\D/g, '');
    try {
      setLoading(true);
      const external_id = `saq_${Date.now()}`;
      const payload = {
        amount: amountNumber,
        external_id,
        pix_key: pixNoSymbolsRaw,
        key_type: type, // fixo
        name: '',       // fixo (vazio)
        taxId: '',    // fixo (vazio) 
        description: 'Solicitação de saque',
        clientCallbackUrl: 'https://seusite.com/callback',
      };

      await withdrawService.solicitarSaque(payload);
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      
      const err = error as { response?: { data?: { message?: string, erro?: string, error?: string } } };
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.erro || 
                          err?.response?.data?.error ||
                          'Erro ao solicitar saque. Tente novamente.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingInit) {
      return (
       <Loading/>
      );
    }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader className="animate-spin text-[var(--primary-color)] mb-4" size={40} />
        <p className="text-gray-400">Solicitando saque, aguarde...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-4 lg:p-8 max-w-2xl mx-auto text-center">
        <CheckCircle2 className="mx-auto text-[var(--primary-color)]" size={64} />
        <h2 className={`mt-6 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Seu saque foi solicitado com sucesso
        </h2>
        <p className="mt-2 text-gray-400">O valor estará disponível na sua conta em até 30 minutos.</p>
      </div>
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
              <h1 className="text-2xl font-bold">Solicitar Saque</h1>
              <p className="text-sm text-gray-400">Retire seu dinheiro via PIX</p>
            </div>
          </div>
        </header>
      )}

      <div className={`p-4 lg:p-8 ${embedded ? 'pt-0' : ''}`}>
        <div className="max-w-2xl mx-auto">
          <div
            className={`${
              isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'
            } rounded-xl p-6 space-y-6 border`}
          >
            <div className={`p-4 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-50'} rounded-lg space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Saldo disponível</span>
                <span className="text-lg font-bold">{utilsservice.formatarParaReal(Number(balance))}</span>
              </div>
              {/*<div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Taxa de saque</span>
                <span className="text-sm font-semibold text-white/90">{utilsservice.formatarParaReal(feeValue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Valor real do saque</span>
                <span className="text-sm font-semibold text-emerald-400">{utilsservice.formatarParaReal(realAmount)}</span>
              </div>*/}
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-400">Chave PIX</span>
                <input
                  type="text"
                  value={pixRawValue}
                  onChange={handleChangePixRawValue}
                  placeholder="Digite CPF, CNPJ, e-mail, telefone ou chave aleatória"
                  className={`w-full h-12 rounded-lg border-2 focus:ring-0 text-base px-4 mt-2 ${
                    isDarkMode
                      ? 'bg-[var(--card-background)] border-white/10'
                      : 'bg-white text-black border-gray-200'
                  } transition-colors`}
                  spellCheck={false}
                  autoComplete="off"
                  maxLength={type === 'CNPJ' ? 0 : 50}
                />
                <span
              className={`block mt-1 font-semibold text-sm mt-3 ml-2 ${
                type === 'CPF'
                  ? 'text-green-600'
                  : type === 'Telefone'
                  ? 'text-blue-600'
                  : type === 'CNPJ'
                  ? 'text-purple-600'
                  : type === 'Email'
                  ? 'text-orange-600'
                  : 'text-gray-500'
              }`}
            >
              Tipo detectado: {type}
            </span>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-400">Valor do saque</span>
                <NumericFormat
                  value={amount}
                  onValueChange={(values) => setAmount(values.value)}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  className={`w-full h-12 rounded-lg border-2 focus:ring-0 text-base px-4 mt-2 ${
                    isDarkMode ? 'bg-[var(--card-background)] border-white/10' : 'bg-white text-black border-gray-200'
                  } transition-colors`}
                  placeholder="0,00"
                  required
                  inputMode="numeric"
                />
              </label>

              <div className="p-4 bg-[var(--primary-color)]/10 rounded-lg border border-[var(--primary-color)]/20">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-[var(--primary-color)] mt-0.5" size={16} />
                  <div>
                    <p className="text-sm text-[var(--primary-color)]">Saque instantâneo</p>
                    <p className="text-xs text-gray-400">O dinheiro cairá na sua conta em até 1 minuto após a confirmação</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`pt-6 border-t ${isDarkMode ? 'border-[var(--card-background)]' : 'border-gray-200'}`}>
              <button
                onClick={handleWithdraw}
                disabled={!pixRawValue || !amount || loading}
                className="w-full bg-[var(--primary-color)] text-white h-12 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Solicitar saque
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}