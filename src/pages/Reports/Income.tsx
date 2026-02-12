import React, { useContext, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, Search, Filter, ChevronRight, ArrowUpRight , ArrowDownRight, ArrowUp, ArrowDown, ArrowDownUp, Check, Plus, X, Hash, ClipboardCopy, Info, Tag, BadgeDollarSign, Wallet, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../lib/theme.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { depositService } from '../../services/depositService';
import { utilsservice } from '../../services/utilsService';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { Loading } from '../../components/Loading';

export default function Income() {
  const { isDarkMode } = useContext(ThemeContext);
  const [data, setReportData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'COMPLETED' | 'PENDING' | ''>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await depositService.getReportTransactions({ pagination : {page, limit}, filters: search, sort: {sortBy , order} });
      setTransactions(data.transactions);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const reportData = await depositService.getReportData();
        const resumoData = await depositService.getResumoDepositos();
        const trans = await depositService.getReportTransactions({ pagination: { page, limit }, filters: search, sort: { sortBy, order } });

        setResumo(resumoData);
        setReportData(reportData);
        setTransactions(trans.transactions);
        setTotalPages(trans.totalPages || 1);
      } catch (error) {
        console.error('Erro ao carregar relatório inicial:', error);
        toast.error("Tivemos um problema ao carregar seu relatório inicial. Espere um pouco!");
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const trans = await depositService.getReportTransactions({ status: filterStatus, pagination : {page, limit}, search, sort: {sortBy , order} });
        setTransactions(trans.transactions);
        setTotalPages(trans.totalPages || 1);
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
        
        const err = error as { response?: { data?: { message?: string, erro?: string, error?: string } } };
        const errorMessage = err?.response?.data?.message || 
                            err?.response?.data?.erro || 
                            err?.response?.data?.error ||
                            'Erro ao carregar o relatório. Espere um pouco!';
        
        toast.error(errorMessage);
      }
      finally{
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, limit, search, sortBy, order, filterStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (status: 'COMPLETED' | 'PENDING' | '') => {
    setFilterStatus(status);
    setShowDropdown(false);
  };

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

  const openModal = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
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
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Relatório de Entradas</h1>
            <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Visualize todas as suas receitas</p>
          </div>
          <button className={`${isDarkMode ? 'bg-[var(--card-background)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} p-2 sm:px-3 sm:py-1.5 rounded-lg text-gray-400 transition-colors`}>
            <Download size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      <div className="p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-4 sm:p-5 rounded-xl border`}>
            <span className="text-xs sm:text-sm text-gray-400">Total (mês)</span>
            <p className="text-xl sm:text-2xl font-bold mt-1 break-words">
              {resumo ? `R$ ${resumo.total_mes_atual.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
            </p>
            <div className={`flex items-center gap-1 text-xs sm:text-sm mt-2 ${resumo?.variacao_total_percentual >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {resumo?.variacao_total_percentual >= 0 ? <ArrowUpRight size={14} className="sm:w-4 sm:h-4" /> : <ArrowDownRight size={14} className="sm:w-4 sm:h-4" />}
              <span>{resumo ? `${resumo.variacao_total_percentual.toFixed(1)}%` : '0%'}</span>
            </div>
          </div>
         
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-4 sm:p-5 rounded-xl border`}>
            <span className="text-xs sm:text-sm text-gray-400">Média diária</span>
            <p className="text-xl sm:text-2xl font-bold mt-1 break-words">
              {resumo ? `R$ ${resumo.media_diaria_mes_atual.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
            </p>
            <div className={`flex items-center gap-1 text-xs sm:text-sm mt-2 ${resumo?.variacao_media_percentual >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {resumo?.variacao_media_percentual >= 0 ? <ArrowUpRight size={14} className="sm:w-4 sm:h-4" /> : <ArrowDownRight size={14} className="sm:w-4 sm:h-4" />}
              <span>{resumo ? `${resumo.variacao_media_percentual.toFixed(1)}%` : '0%'}</span>
            </div>
          </div>
         
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-4 sm:p-5 rounded-xl border`}>
            <span className="text-xs sm:text-sm text-gray-400">Maior entrada</span>
            <p className="text-xl sm:text-2xl font-bold mt-1 break-words">
              {resumo?.maior_entrada?.valor != null
                ? `R$ ${resumo.maior_entrada.valor.toFixed(2).replace('.', ',')}`
                : 'R$ 0,00'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {resumo?.maior_entrada?.data
                ? new Date(resumo.maior_entrada.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
                : '--'}
            </p>
          </div>
         
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-4 sm:p-5 rounded-xl border`}>
            <span className="text-xs sm:text-sm text-gray-400">Menor entrada</span>
            <p className="text-xl sm:text-2xl font-bold mt-1 break-words">
              {resumo?.menor_entrada?.valor != null
                ? `R$ ${resumo.menor_entrada.valor.toFixed(2).replace('.', ',')}`
                : 'R$ 0,00'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {resumo?.menor_entrada?.data
                ? new Date(resumo.menor_entrada.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
                : '--'}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-4 sm:p-6 rounded-xl border`}>
          <div className="flex flex-col gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-1">Entradas diárias</h2>
              <p className="text-xs sm:text-sm text-gray-400">Acompanhe suas receitas por dia</p>
            </div>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-[var(--card-background)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-1.5 rounded-lg cursor-pointer transition-colors self-start`}>
              <span className="text-xs sm:text-sm text-gray-400">Última semana</span>
              <ChevronRight size={14} className="text-gray-400 sm:w-4 sm:h-4" />
            </div>
          </div>
         
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid stroke={isDarkMode ? '#1E1E2E' : '#f0f0f0'} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#4B5563"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#4B5563"
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                  width={60}
                />
                 <Tooltip 
                formatter={(value: number, name: string) => {
                const labelMap: Record<string, string> = {
                income: 'Entrada',
                };
                return [
                new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                }).format(value),
                labelMap[name] || (name.charAt(0).toUpperCase() + name.slice(1))
                ];
                }}
                contentStyle={{
                backgroundColor: isDarkMode ? '#1E1E2E' : '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '0.875rem',
                }}
                labelStyle={{ color: isDarkMode ? '#f3f4f6' : '#374151', fontWeight: 600 }}
                itemStyle={{ color: isDarkMode ? '#d1d5db' : '#4B5563' }}
                cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="var(--primary-color)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
          <div className={`p-3 sm:p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-100'} px-3 py-2 rounded-lg`}>
                <Search size={16} className="text-gray-400 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Buscar transação..."
                  className="bg-transparent border-none focus:outline-none text-xs sm:text-sm flex-1 text-gray-400 placeholder-gray-500"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="relative inline-block" ref={dropdownRef}>
                {/* Botão principal */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center gap-2 ${
                    isDarkMode
                      ? 'bg-[var(--card-background)] hover:bg-[#2A2A3A]'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } px-3 py-2 rounded-lg text-gray-400 transition-colors whitespace-nowrap`}
                >
                  <Filter size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Filtros</span>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div
                    className={`absolute mt-2 z-10 w-40 rounded-lg shadow-lg ${
                      isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'
                    } border border-gray-200 dark:border-gray-700`}
                  >
                    <button
                      onClick={() => handleSelect('')}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-t-lg ${
                        filterStatus === ''
                          ? 'bg-[var(--primary-light)] text-[var(--primary-color)]'
                          : isDarkMode
                          ? 'text-white hover:bg-[#2A2A3A]'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      TODOS
                      {filterStatus === '' && <Check size={14} />}
                    </button>
                    <button
                      onClick={() => handleSelect('COMPLETED')}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-t-lg ${
                        filterStatus === 'COMPLETED'
                          ? 'bg-[var(--primary-light)] text-[var(--primary-color)]'
                          : isDarkMode
                          ? 'text-white hover:bg-[#2A2A3A]'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Completo
                      {filterStatus === 'COMPLETED' && <Check size={14} />}
                    </button>

                    <button
                      onClick={() => handleSelect('PENDING')}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-b-lg ${
                        filterStatus === 'PENDING'
                          ? 'bg-[var(--primary-light)] text-[var(--primary-color)]'
                          : isDarkMode
                          ? 'text-white hover:bg-[#2A2A3A]'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Pendente
                      {filterStatus === 'PENDING' && <Check size={14} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-400">Carregando...</div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className={`p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'} last:border-b-0`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400">ID: {transaction.transaction_id}</p>
                      </div>
                      <span className="text-sm font-medium text-green-500 ml-2">
                        {utilsservice.formatarParaReal(Number(transaction.amount))}
                      </span>
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
                      <button
                        onClick={() => openModal(transaction)}
                        className="text-[var(--primary-color)]"
                        title="Ver mais detalhes"
                      >
                        <span>Detalhes</span>
                      </button>
                    </div>
                    
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-400">Carregando...</div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                  <th
                    className="p-4 text-sm font-medium text-gray-400 cursor-pointer select-none"
                    onClick={() => handleSort('transaction_id')}
                  >
                    <div className="flex items-center gap-1">
                      Id da Transação
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
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Nome do Cliente</th>
                  <th
                    className="p-4 text-sm font-medium text-gray-400 cursor-pointer select-none"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Valor
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
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th
                    className="p-4 text-sm font-medium text-gray-400 cursor-pointer select-none"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      Data
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
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[var(--card-background)]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <td className="p-3 lg:p-4">
                      <span className="text-xs lg:text-sm">{transaction.transaction_id}</span>
                    </td>
                    <td className="p-3 lg:p-4">
                      <span className="text-xs lg:text-sm">{transaction.payer.name}</span>
                    </td>
                    <td className="p-3 lg:p-4">
                      <span className="text-xs lg:text-sm text-green-500">{utilsservice.formatarParaReal(Number(transaction.amount))}</span>
                    </td>
                    <td className="p-3 lg:p-4">
                      <span
                        className={`
                          text-xs lg:text-sm font-medium px-2 py-1 rounded-lg
                          ${transaction.status === 'COMPLETED' ? 'text-green-700 bg-green-500/10' :
                            transaction.status === 'PENDING' ? 'text-yellow-800 bg-yellow-500/10' :
                            'text-red-700 bg-red-500/10'}
                        `}
                      >
                        {transaction.status === 'COMPLETED' ? 'Completo' :
                        transaction.status === 'PENDING' ? 'Pendente' :
                        transaction.status}
                      </span>
                    </td>
                    <td className="p-3 lg:p-4">
                      <span className="text-xs lg:text-sm text-gray-400">{transaction.date}</span>
                    </td>
                    <td className="p-3 lg:p-4">
                      <button
                        onClick={() => openModal(transaction)}
                        className="text-[var(--primary-color)] "
                        title="Ver mais detalhes"
                      >
                        <Plus size={16} />
                      </button>
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
              Página Anterior
            </button>
            <span className="text-xs sm:text-sm text-gray-400">Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="text-xs sm:text-sm text-gray-500 hover:underline disabled:opacity-30 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:cursor-not-allowed"
            >
              Próxima Página
            </button>
          </div>
        </div>
        {/* Details Modal */}
        {isModalOpen && selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
            <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/10' : 'bg-white border-gray-200'} w-full max-w-[92vw] sm:max-w-2xl rounded-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden max-h-[90vh] flex flex-col`}>
              {/* Header */}
              <div className={`px-4 py-3 sm:px-6 sm:py-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <Info size={18} className="text-[var(--primary-color)]" />
                  <h2 className="text-lg font-semibold">Detalhes da Transação</h2>
                </div>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Status + Valor + Método */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center gap-2`}>
                    {(selectedTransaction.status === 'COMPLETED' ? <CheckCircle2 className="text-green-500" size={18} /> : selectedTransaction.status === 'PENDING' ? <Clock className="text-yellow-500" size={18} /> : <Clock className="text-red-500" size={18} />)}
                    <span className={`text-sm font-medium ${selectedTransaction.status === 'COMPLETED' ? 'text-green-500' : selectedTransaction.status === 'PENDING' ? 'text-yellow-500' : 'text-red-500'}`}>
                      {selectedTransaction.status === 'COMPLETED' ? 'Completo' : selectedTransaction.status === 'PENDING' ? 'Pendente' : selectedTransaction.status}
                    </span>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between`}>
                    <span className="text-sm text-gray-400">Valor</span>
                    <span className="font-semibold">{utilsservice.formatarParaReal(Number(selectedTransaction.amount))}</span>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between`}>
                    <span className="text-sm text-gray-400">Método</span>
                    <span className="inline-flex items-center gap-2 font-medium">{selectedTransaction.method?.toUpperCase() === 'PIX' ? <BadgeDollarSign size={16} /> : <Wallet size={16} />}{selectedTransaction.method?.toUpperCase()}</span>
                  </div>
                </div>

                {/* Identificadores */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-400">Informações da transação</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                      <div className="flex items-center gap-2"><Hash size={16} className="text-gray-400" /><span className="text-sm text-gray-400">ID interno</span></div>
                      <div className="flex items-center gap-2"><code className="text-xs">{selectedTransaction.id}</code><button onClick={()=>navigator.clipboard?.writeText(String(selectedTransaction.id))} className="p-1 rounded hover:bg-white/5"><ClipboardCopy size={14} /></button></div>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                      <div className="flex items-center gap-2"><Hash size={16} className="text-gray-400" /><span className="text-sm text-gray-400">ID da transação</span></div>
                      <div className="flex items-center gap-2"><code className="text-xs break-all max-w-[220px] md:max-w-[280px]">{selectedTransaction.transaction_id}</code><button onClick={()=>navigator.clipboard?.writeText(String(selectedTransaction.transaction_id))} className="p-1 rounded hover:bg-white/5"><ClipboardCopy size={14} /></button></div>
                    </div>
                    {selectedTransaction.end_to_end && (
                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                        <div className="flex items-center gap-2"><Hash size={16} className="text-gray-400" /><span className="text-sm text-gray-400">E2E</span></div>
                        <div className="flex items-center gap-2"><code className="text-xs break-all max-w-[220px] md:max-w-[280px]">{selectedTransaction.end_to_end}</code><button onClick={()=>navigator.clipboard?.writeText(String(selectedTransaction.end_to_end))} className="p-1 rounded hover:bg-white/5"><ClipboardCopy size={14} /></button></div>
                      </div>
                    )}
                    {selectedTransaction.description && (
                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                        <div className="flex items-center gap-2"><Info size={16} className="text-gray-400" /><span className="text-sm text-gray-400">Descrição</span></div>
                        <span className="text-sm">{selectedTransaction.description}</span>
                      </div>
                    )}
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                      <div className="flex items-center gap-2"><BadgeDollarSign size={16} className="text-gray-400" /><span className="text-sm text-gray-400">Taxa</span></div>
                      <span className="text-sm">{utilsservice.formatarParaReal(Number(selectedTransaction.fee))}</span>
                    </div>
                    {selectedTransaction.category && (
                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                        <div className="flex items-center gap-2"><Tag size={16} className="text-gray-400" /><span className="text-sm text-gray-400">Categoria</span></div>
                        <span className="text-sm">{selectedTransaction.category}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pagador + Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400"><Wallet size={18} /><span className="text-sm">Informações do pagador</span></div>
                    <div className={`p-4 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} rounded-xl space-y-2`}>
                      <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Nome</span><span className="text-sm font-medium">{selectedTransaction.payer?.name}</span></div>
                      <div className="flex items-center justify-between"><span className="text-sm text-gray-400">Documento</span><span className="text-sm font-medium">{selectedTransaction.payer?.document || '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-sm text-gray-400">E‑mail</span><span className="text-sm font-medium">{selectedTransaction.payer?.email || '-'}</span></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400"><Calendar size={18} /><span className="text-sm">Data e hora</span></div>
                    <div className={`p-4 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} rounded-xl`}>
                      <p className="text-sm text-gray-300">{selectedTransaction.date}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`px-4 py-3 sm:px-6 sm:py-4 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-200'} flex items-center justify-end`}>
                <button onClick={closeModal} className="px-4 h-10 rounded-lg bg-[var(--primary-color)] text-white font-medium hover:opacity-90">Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}