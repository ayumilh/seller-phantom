import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ArrowLeft, Search, Filter, ArrowUp, ArrowDown, ArrowDownUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../lib/theme.ts';
import { depositService } from '../../services/depositService';
import { utilsservice } from '../../services/utilsService';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { Loading } from '../../components/Loading';

export default function BlockIncome() {
  const intl = useIntl();
  const { isDarkMode } = useContext(ThemeContext);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [defenseMessage, setDefenseMessage] = useState('');


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await depositService.getReportBlockTransactions({ page, limit, search, sortBy, order });
      setTransactions(data.transactions);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await depositService.getReportBlockTransactions({ page, limit, search, sortBy, order });
        setTransactions(data.transactions);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
        
        const err = error as { response?: { data?: { message?: string, erro?: string, error?: string } } };
        const errorMessage = err?.response?.data?.message || 
                            err?.response?.data?.erro || 
                            err?.response?.data?.error ||
                            'Erro ao carregar seu relatório. Espere um pouco!';
        
        toast.error(errorMessage);
      }
      finally{
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, limit, search, sortBy, order]);

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setOrder('ASC');
    }
    setPage(1);
  };

  const handleSendDefense = async () => {
    if (!selectedTransaction) return;

    try {
      await depositService.sendDefense(selectedTransaction.infraction_id, defenseMessage);

      toast.success('Defesa enviada com sucesso!');
      closeDefenseModal();
      
      fetchData();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string, erro?: string, error?: string } } };
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.erro || 
                          err?.response?.data?.error ||
                          'Erro ao enviar defesa. Tente novamente.';
      
      toast.error(errorMessage);
    }
  };


  const openDefenseModal = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDefenseMessage(transaction.defaultDefenseMessage || 'Mensagem padrão para defesa MED...');
    setIsModalOpen(true);
  };

  const closeDefenseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setDefenseMessage('');
  };


  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <>
      <header className={`sticky top-0 z-20 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} px-3 sm:px-4 lg:px-8 py-3 sm:py-4`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base lg:text-xl xl:text-2xl font-bold leading-tight">{intl.formatMessage({ id: 'reports.blockedReport' })}</h1>
            <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">{intl.formatMessage({ id: 'reports.blockedReport' })}</p>
          </div>
        </div>
      </header>

      <div className="p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6">
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
          <div className={`p-3 sm:p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-100'} px-3 py-2 rounded-lg`}>
                <Search size={16} className="text-gray-400 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder={intl.formatMessage({ id: 'reports.searchTransaction' })}
                  className="bg-transparent border-none focus:outline-none text-xs sm:text-sm flex-1 text-gray-400 placeholder-gray-500"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-400">{intl.formatMessage({ id: 'common.loading' })}</div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className={`p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'} last:border-b-0`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{transaction.description}</p>
                        <p className="text-xs text-gray-400">ID: {transaction.transaction_id}</p>
                      </div>
                      <span className="text-sm font-medium text-green-500 ml-2">
                        {utilsservice.formatarParaReal(Number(transaction.amount))}
                      </span>
                    </div>
                   
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="text-gray-400">{transaction.category}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{transaction.method}</span>
                    </div>
                   
                    <div className="flex justify-between items-center">
                      <span
                        className={`
                          text-xs font-medium px-2 py-1 rounded-lg
                          ${transaction.status === 'COMPLETED' ? 'text-green-700 bg-green-500/10' :
                            transaction.status === 'PENDING' ? 'text-yellow-800 bg-yellow-500/10' :
                            'text-red-700 bg-red-500/10'}
                        `}
                      >
                        {transaction.status === 'COMPLETED' ? 'Completo' :
                        transaction.status === 'PENDING' ? 'Pendente' :
                        transaction.status}
                      </span>
                      <span className="text-xs text-gray-400">{transaction.date}</span>
                    </div>
                   
                    {transaction.end_to_end && (
                      <div className="text-xs text-gray-400">
                        E2E: {transaction.end_to_end}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-400">{intl.formatMessage({ id: 'common.loading' })}</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                    <th
                      className="p-4 text-sm font-medium text-gray-400 cursor-pointer select-none"
                      onClick={() => handleSort('transaction_id')}
                    >
                      <div className="flex items-center gap-1">
                      {intl.formatMessage({ id: 'reports.transactionId' })}
                        {sortBy === 'transaction_id' ? (
                          order === 'ASC' ? (
                            <ArrowUp size={14} className="text-white" />
                          ) : (
                            <ArrowDown size={14} className="text-white" />
                          )
                        ) : (
                          <ArrowDownUp size={14} className="text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'reports.descriptionCol' })}</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'reports.method' })}</th>
                    <th
                      className="p-4 text-sm font-medium text-gray-400 cursor-pointer select-none"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center gap-1">
                        {intl.formatMessage({ id: 'reports.amount' })}
                        {sortBy === 'amount' ? (
                          order === 'ASC' ? (
                            <ArrowUp size={14} className="text-white" />
                          ) : (
                            <ArrowDown size={14} className="text-white" />
                          )
                        ) : (
                          <ArrowDownUp size={14} className="text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'reports.status' })}</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'reports.e2e' })}</th>
                    <th
                      className="p-4 text-sm font-medium text-gray-400 cursor-pointer select-none"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center gap-1">
                        {intl.formatMessage({ id: 'reports.date' })}
                        {sortBy === 'created_at' ? (
                          order === 'ASC' ? (
                            <ArrowUp size={14} className="text-white" />
                          ) : (
                            <ArrowDown size={14} className="text-white" />
                          )
                        ) : (
                          <ArrowDownUp size={14} className="text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'reports.replyMed' })}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[var(--card-background)]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                      <td className="p-4 text-sm">{transaction.transaction_id}</td>
                      <td className="p-4 text-sm">{transaction.description}</td>
                      <td className="p-4 text-sm text-gray-400">{transaction.method}</td>
                      <td className="p-4 text-sm text-green-500">{utilsservice.formatarParaReal(Number(transaction.amount))}</td>
                      <td className="p-4">
                        <span className={`
                          text-sm font-medium px-2 py-1 rounded-lg
                          ${transaction.status === 'COMPLETED' ? 'text-green-700 bg-green-500/10' :
                          transaction.status === 'PENDING' ? 'text-yellow-800 bg-yellow-500/10' :
                          'text-red-700 bg-red-500/10'}
                        `}>
                          {transaction.status === 'COMPLETED' ? intl.formatMessage({ id: 'reports.completed' }) :
                          transaction.status === 'PENDING' ? intl.formatMessage({ id: 'reports.pending' }) :
                          transaction.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400">{transaction.end_to_end}</td>
                      <td className="p-4 text-sm text-gray-400">{transaction.date}</td>
                      <td className="p-4 text-sm text-gray-400">
                        {transaction.med_respondido ? (
                          <span>{intl.formatMessage({ id: 'reports.completed' })}</span>
                        ) : transaction.infraction_id ? (
                          <button
                            onClick={() => openDefenseModal(transaction)}
                            className="text-blue-600 hover:underline"
                          >
                            {intl.formatMessage({ id: 'reports.reply' })}
                          </button>
                        ) : (
                          <span className="text-gray-400 italic">{intl.formatMessage({ id: 'reports.unavailable' })}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Paginação */}
          <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="text-xs sm:text-sm text-gray-500 hover:underline disabled:opacity-30 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:cursor-not-allowed"
            >
              {intl.formatMessage({ id: 'reports.previousPage' })}
            </button>
            <span className="text-xs sm:text-sm text-gray-400">{intl.formatMessage({ id: 'common.pageOf', values: { page, total: totalPages } })}</span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="text-xs sm:text-sm text-gray-500 hover:underline disabled:opacity-30 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:cursor-not-allowed"
            >
              {intl.formatMessage({ id: 'reports.nextPage' })}
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[var(--card-background)] text-gray-900 dark:text-[var(--text-color)] rounded-2xl w-full max-w-4xl h-[80vh] p-8 shadow-2xl overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{intl.formatMessage({ id: 'reports.replyMed' })}</h2>

            <textarea
              rows={10}
              className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-[var(--input-background)] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={defenseMessage}
              onChange={(e) => setDefenseMessage(e.target.value)}
            />

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeDefenseModal}
                className="px-5 py-3 rounded-xl text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendDefense}
                className="px-5 py-3 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}