import React, { useContext, useState, useEffect } from 'react';
import { ArrowLeft, Copy, CheckCircle2, Wallet, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import { withdrawService } from '../services/withdrawService';
import { toast } from 'sonner';

export default function CryptoWithdraw({ embedded = false }: { embedded?: boolean }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [usdtAddress, setUsdtAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [usdtPrice, setUsdtPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [fee, setFee] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const balanceUser = await withdrawService.getBalanceUser();
        setBalance(balanceUser.balance);
      } catch (error) {
        console.error('Erro ao buscar saldo:', error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchPrice() {
      setLoading(true);
      const price = await withdrawService.getUsdToBrlRate();
      setUsdtPrice(price);
      setLoading(false);
    }
    fetchPrice();
  }, []);


  useEffect(() => {
    if (amount) {
      const amountNumber = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
      const feeAmount = amountNumber * 0.03; // 3% fee
      setFee(feeAmount);
      setTotal(amountNumber + feeAmount);
    } else {
      setFee(0);
      setTotal(0);
    }
  }, [amount]);

  const handleWithdraw = async () => {
    const amountNumber = parseFloat(amount.replace(',', '.'));
    const balanceNumber = parseFloat(balance);

    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Por favor, insira um valor válido para o saque.');
      return;
    }
    if (amountNumber > balanceNumber) {
      toast.error('O valor do saque não pode ser maior que o saldo disponível.');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        amount: (amountNumber / usdtPrice),
        wallet_address: usdtAddress,
        conversionRate: usdtPrice
      };

      await withdrawService.setUsdToBrlRate(payload);
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
            <Link to="/sacar" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Saque em USDT</h1>
              <p className="text-sm text-gray-400">Retire seu dinheiro em criptomoeda</p>
            </div>
          </div>
        </header>
      )}

      <div className={`p-4 lg:p-8 ${embedded ? 'pt-0' : ''}`}>
        <div className="max-w-2xl mx-auto">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 space-y-6 border`}>
            <div className={`p-4 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Saldo disponível</span>
                <span className="text-lg font-bold">R$ {balance}</span>
              </div>
            </div>

            <div className={`p-4 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Cotação USDT</span>
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-6 w-24 rounded" />
                ) : (
                  <span className="text-lg font-bold">R$ {usdtPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-400">Endereço USDT (TRC20)</span>
                <input
                  type="text"
                  value={usdtAddress}
                  onChange={(e) => setUsdtAddress(e.target.value)}
                  className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                  placeholder="Digite seu endereço USDT"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-400">Valor do saque</span>
                <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-[var(--primary-color)] px-3`}>
                  <span className="text-gray-400">R$</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                    placeholder="0,00"
                  />
                </div>
              </label>

              {amount && (
                <div className={`p-4 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-50'} rounded-lg space-y-2`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Taxa (3%)</span>
                    <span>R$ {fee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total a pagar</span>
                    <span className="font-medium">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Você receberá</span>
                    <span className="font-medium">
                      {loading ? (
                        <div className="animate-pulse bg-gray-600 h-4 w-24 rounded" />
                      ) : (
                        `${(total / usdtPrice).toFixed(2)} USDT`
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-[var(--primary-color)]/10 rounded-lg border border-[var(--primary-color)]/20">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-[var(--primary-color)] mt-0.5" size={16} />
                  <div>
                    <p className="text-sm text-[var(--primary-color)]">Saque instantâneo</p>
                    <p className="text-xs text-gray-400">O dinheiro cairá na sua carteira em até 5 minutos após a confirmação</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`pt-6 border-t ${isDarkMode ? 'border-[var(--card-background)]' : 'border-gray-200'}`}>
              <button onClick={handleWithdraw} className="w-full bg-[var(--primary-color)] text-white h-12 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors font-medium">
                Solicitar saque
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}