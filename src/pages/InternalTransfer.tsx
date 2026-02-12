import React, { useContext, useEffect, useState } from 'react';
import { ArrowLeft, Send, Search, History, CheckCircle2, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import { withdrawService } from '../services/withdrawService.ts';
import { Loading } from '../components/Loading.tsx';
import { toast } from 'sonner';

export default function InternalTransfer({ embedded = false }: { embedded?: boolean }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(false);

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
  
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setLoadingInit(true);
        const data  = await withdrawService.getInternalTransfers();
        setTransfers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao buscar transferências internas:', error);
        setTransfers([]);
      } finally {
        setLoadingInit(false);
      }
    };
    fetchTransfers();
  }, []);

  useEffect(() => {
    if (selectedEmail) return; // se email foi selecionado, não busca mais
    if (email.length > 2) {
      const delayDebounce = setTimeout(async () => {
        const result = await withdrawService.getUsersByEmail(email);
        setUsers(result);
      }, 400);

      return () => clearTimeout(delayDebounce);
    } else {
      setUsers([]);
    }
  }, [email, selectedEmail]);

  // quando clica no email da lista:
  const handleSelectEmail = (emailSelecionado: any) => {
    setEmail(emailSelecionado);
    setSelectedEmail(true);
    setUsers([]); // limpa dropdown
  };

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
        amount: amountNumber,
        recipient_email: email
      };

      await withdrawService.setInternalTransfers(payload);
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
        <p className="text-gray-400">Solicitando transferencia, aguarde...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-4 lg:p-8 max-w-2xl mx-auto text-center">
        <CheckCircle2 className="mx-auto text-[var(--primary-color)]" size={64} />
        <h2 className={`mt-6 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Sua transferência foi solicitada com sucesso
        </h2>
        <p className="mt-2 text-gray-400">O valor estará disponível na conta em até 5 minutos.</p>
      </div>
    );
  }


  if (loadingInit) {
    return (
      <Loading/>
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
              <h1 className="text-2xl font-bold">Transferência Interna</h1>
              <p className="text-sm text-gray-400">Transfira dinheiro entre contas</p>
            </div>
          </div>
        </header>
      )}

      <div className={`p-4 lg:p-8 ${embedded ? 'pt-0' : ''}`}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transfer Form */}
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 space-y-6 border`}>
            <div className={`p-4 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Saldo disponível</span>
                <span className="text-lg font-bold">R$ {balance}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block relative w-full">
                <span className="text-sm font-medium text-gray-400">
                  Email do destinatário
                </span>

                <div
                  className={`mt-1 flex items-center gap-2 rounded-lg ${
                    isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'
                  } border-2 focus-within:border-[var(--primary-color)] px-3 relative`}
                >
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSelectedEmail(false); // sempre volta para "modo pesquisa"
                    }}
                    className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                    placeholder="Digite o email"
                  />

                  {users.length > 0 && (
                    <ul
                      className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow-lg z-10 border 
                        ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'}`}
                    >
                      {users.map((u) => (
                        <li
                          key={u?.id}
                          onClick={() => handleSelectEmail(u?.email)}
                          className={`px-3 py-2 cursor-pointer text-sm 
                            ${isDarkMode 
                              ? 'hover:bg-white/10 text-gray-200' 
                              : 'hover:bg-gray-100 text-gray-800'}`}
                        >
                          {u?.email}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-400">Valor</span>
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
            </div>

            <div className={`pt-6 border-t ${isDarkMode ? 'border-[var(--card-background)]' : 'border-gray-200'}`}>
              <button onClick={handleWithdraw} className="w-full bg-[var(--primary-color)] text-white h-12 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors font-medium flex items-center justify-center gap-2">
                <Send size={20} />
                Transferir
              </button>
            </div>
          </div>

          {/* Transfer History */}
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <History size={20} className="text-[var(--primary-color)]" />
                <h2 className="text-lg font-semibold">Histórico</h2>
              </div>
            </div>

            <div className="divide-y divide-[#1E1E2E]">
              {transfers.map(transfer => (
                <div
                  key={transfer.id}
                  className={`p-4 ${isDarkMode ? 'hover:bg-[var(--card-background)]/50' : 'hover:bg-gray-50'} transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{transfer.user}</p>
                      <p className="text-sm text-gray-400">{transfer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transfer.type === 'received' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transfer.type === 'received' ? '+' : '-'} {transfer.amount}
                      </p>
                      <p className="text-xs text-gray-400">{transfer.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}