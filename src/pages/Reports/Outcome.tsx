import React, { useContext, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, Search, Filter, ChevronRight, ArrowDownRight , ArrowUpRight, Check, ArrowUp, ArrowDown, ArrowDownUp, ReceiptIcon} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../lib/theme.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { withdrawService } from '../../services/withdrawService';
import { utilsservice } from '../../services/utilsService';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { Loading } from '../../components/Loading';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../../dist/assets/logo.png';

export default function Outcome() {
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
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [loadingReceipt, setLoadingReceipt] = useState(false);
  const receiptRef = useRef();
  const downloadBtnRef = useRef(null);
  const closeBtnRef = useRef(null);

  async function fetchReceipt(transactionId: any) {
    try {
      setLoadingReceipt(true);
      const data = await withdrawService.getReceipt(transactionId);
      setReceiptData(data);
      setReceiptModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar comprovante:', error);
      
      const err = error as { response?: { data?: { message?: string, erro?: string, error?: string } } };
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.erro || 
                          err?.response?.data?.error ||
                          'Erro ao buscar comprovante.';
      
      toast.error(errorMessage);
    } finally {
      setLoadingReceipt(false);
    }
  }

  function handleDownloadPDF() {
    if (!receiptRef.current || !downloadBtnRef.current || !closeBtnRef.current) return;

    // Esconde o botão temporariamente
    downloadBtnRef.current.style.visibility = 'hidden';
    closeBtnRef.current.style.visibility = 'hidden';

    html2canvas(receiptRef.current, { scale: 2 }).then((canvas) => {
      // Reexibe o botão
      downloadBtnRef.current.style.visibility = 'visible';
      closeBtnRef.current.style.visibility = 'visible';

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      const positionY = 0;

      pdf.addImage(imgData, 'PNG', 0, positionY, imgWidth, imgHeight);
      pdf.save(`comprovante-${receiptData.transaction_id}.pdf`);
    });
  }


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await withdrawService.getReportTransactions({ pagination : {page, limit}, filters: search, sort: {sortBy , order} });
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
        const reportData = await withdrawService.getReportData();
        const resumoData = await withdrawService.getResumoSaques();
        const trans = await withdrawService.getReportTransactions({ pagination: { page, limit }, filters: search, sort: { sortBy, order } });

        setResumo(resumoData);
        setReportData(reportData);
        setTransactions(trans.transactions);
        setTotalPages(trans.totalPages || 1);
      } catch (error) {
        console.error('Erro ao carregar relatório inicial:', error);
        
        const err = error as { response?: { data?: { message?: string, erro?: string, error?: string } } };
        const errorMessage = err?.response?.data?.message || 
                            err?.response?.data?.erro || 
                            err?.response?.data?.error ||
                            'Problema ao carregar relatório inicial. Espere um pouco!';
        
        toast.error(errorMessage);
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
        const trans = await withdrawService.getReportTransactions({ status: filterStatus, pagination : {page, limit}, search, sort: {sortBy , order} });
        setTransactions(trans.transactions);
        setTotalPages(trans.totalPages || 1);
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
        
        const err = error as { response?: { data?: { message?: string, erro?: string, error?: string } } };
        const errorMessage = err?.response?.data?.message || 
                            err?.response?.data?.erro || 
                            err?.response?.data?.error ||
                            'Problema ao carregar seu relatório. Espere um pouco!';
        
        toast.error(errorMessage);
      }
      finally {
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
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Relatório de Saídas</h1>
            <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Visualize todas as suas despesas</p>
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
            <span className="text-xs sm:text-sm text-gray-400">Maior saída</span>
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
            <span className="text-xs sm:text-sm text-gray-400">Menor saída</span>
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
              <h2 className="text-base sm:text-lg font-semibold mb-1">Saídas diárias</h2>
              <p className="text-xs sm:text-sm text-gray-400">Acompanhe suas despesas por dia</p>
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
                        outcome: 'Saída',
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
                  dataKey="outcome"
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
            {transactions.map((transaction) => (
              <div key={transaction.id} className={`p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'} last:border-b-0`}>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{transaction.description}</p>
                      <p className="text-xs text-gray-400">ID: {transaction.transaction_id}</p>
                    </div>
                    <span className="text-sm font-medium text-red-500 ml-2">
                      -{utilsservice.formatarParaReal(Number(transaction.amount))}
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
                    {transaction.has_receipt ? (
                      <button
                        onClick={() => fetchReceipt(transaction.transaction_id)}
                        className="flex items-center gap-1 text-blue-500 hover:underline text-xs lg:text-sm"
                        title="Visualizar comprovante"
                      >
                        <ReceiptIcon size={16} /> Comprovante
                      </button>
                    ) : (
                      <span className="text-xs lg:text-sm text-gray-400">Indisponível</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
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
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Categoria</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Método</th>
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
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Comprovante</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[var(--card-background)]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <td className="p-3 lg:p-4">
                      <span className="text-xs lg:text-sm">{transaction.transaction_id}</span>
                    </td>
                    <td className="p-3 lg:p-4">
                      <span className="text-xs lg:text-sm text-gray-400">{transaction.category}</span>
                    </td>
                    <td className="p-3 lg:p-4">
                      <span className="text-xs lg:text-sm text-gray-400">{transaction.method}</span>
                    </td>
                    <td className="p-3 lg:p-4">
                      <span className="text-xs lg:text-sm text-red-500">-{utilsservice.formatarParaReal(Number(transaction.amount))}</span>
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
                      {transaction.has_receipt ? (
                        <button
                          onClick={() => fetchReceipt(transaction.transaction_id)}
                          className="flex items-center gap-1 text-blue-500 hover:underline text-xs lg:text-sm"
                          title="Visualizar comprovante"
                        >
                          <ReceiptIcon size={16} /> Comprovante
                        </button>
                      ) : (
                        <span className="text-xs lg:text-sm text-gray-400">Indisponível</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        {receiptModalOpen && receiptData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div 
              className="bg-white dark:bg-[var(--card-background)] rounded-xl shadow-2xl w-full max-w-sm relative overflow-hidden border border-gray-200 dark:border-white/5"
              ref={receiptRef}
            >
              {/* Header simples */}
              <div className="bg-[var(--primary-color)] p-4 pb-8 text-white relative">
                <button
                  onClick={() => setReceiptModalOpen(false)}
                  ref={closeBtnRef}
                  className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="text-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-8 mb-2 mx-auto filter brightness-0 invert saturate-0"
                  />
                  <h2 className="text-lg font-bold">Comprovante de Saque</h2>
                </div>
              </div>

              {/* Ícone de sucesso - com espaçamento adequado */}
              <div className="flex justify-center -mt-6 mb-6 relative z-10">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-[var(--card-background)]">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="px-4 pb-4 space-y-3">
                {/* Valor em destaque */}
                <div className="text-center bg-[var(--primary-light)] rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Valor do Saque</p>
                  <p className="text-xl font-bold text-[var(--primary-color)]">
                    R$ {Number(receiptData.amount).toFixed(2).replace('.', ',')}
                  </p>
                </div>

                {/* Informações da transação */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">ID Transação</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white font-mono">
                      {receiptData.transaction_id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Recebedor</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {receiptData.nome_recebedor}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Documento</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white font-mono">
                      {receiptData.cpf_recebedor}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Banco</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {receiptData.banco}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Data</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {receiptData.created_at}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      Saque processado com sucesso
                    </span>
                  </div>
                </div>

                {/* Botão de download */}
                <button
                  ref={downloadBtnRef}
                  onClick={handleDownloadPDF}
                  className="print:hidden mt-4 w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Baixar Comprovante PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}