import React, { useContext, useEffect, useState } from 'react';
import { ArrowLeft, Download, Search, Filter, ChevronRight, ArrowUpRight, Moon, Sun, ArrowDownRight } from 'lucide-react';
import { ThemeContext } from '../../lib/theme.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { splitService } from '../../services/splitService';
import { utilsservice } from '../services/utilsService';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { Loading } from '../../components/Loading';

export default function Split() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await splitService.getReportTransactions({ pagination : {page, limit}, filters: search, sort: {sortBy , order} });
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
        const reportData = await splitService.getReportData();
        const resumoData = await splitService.getResumoDepositos();
        const trans = await splitService.getReportTransactions({ pagination: { page, limit }, filters: search, sort: { sortBy, order } });

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
                            'Erro ao carregar seu relatório inicial. Espere um pouco!';
        
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
        const trans = await splitService.getReportTransactions({ pagination : {page, limit}, search, sort: {sortBy , order} });
        setTransactions(trans.transactions);
        setTotalPages(trans.totalPages || 1);
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
        
        const err = error as { response?: { data?: { message?: string, erro?: string, error?: string } } };
        const errorMessage = err?.response?.data?.message || 
                            err?.response?.data?.erro || 
                            err?.response?.data?.error ||
                            'Erro ao carregar seu relatório. Espere um pouco!';
        
        toast.error(errorMessage);
      }
      finally {
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

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-[var(--background-color)]/90' : 'bg-gray-50/90'} px-4 lg:px-8 py-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors lg:hidden">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold">Relatório de Splits</h1>
            <p className="text-xs lg:text-sm">Visualize todos os splits recebidos</p>
          </div>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 lg:p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-3 lg:p-5 rounded-xl border transition-all duration-300 hover:shadow-lg`}>
            <span className="text-xs lg:text-sm font-semibold">Total (mês)</span>
            <p className="text-lg lg:text-2xl font-bold mt-1">{resumo ? `R$ ${resumo.total_mes_atual.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}</p>
            <div className="flex items-center gap-1 text-green-500 text-xs lg:text-sm mt-2">
              {resumo?.variacao_total_percentual >= 0 ? <ArrowUpRight size={14} className="sm:w-4 sm:h-4" /> : <ArrowDownRight size={14} className="sm:w-4 sm:h-4" />}
              <span>{resumo?.variacao_total_percentual ? `${resumo.variacao_total_percentual.toFixed(1)}%` : '0%'}</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-3 lg:p-5 rounded-xl border transition-all duration-300 hover:shadow-lg`}>
            <span className="text-xs lg:text-sm font-semibold">Média diária</span>
            <p className="text-lg lg:text-2xl font-bold mt-1">{resumo ? `R$ ${resumo.media_diaria_mes_atual.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}</p>
            <div className="flex items-center gap-1 text-green-500 text-xs lg:text-sm mt-2">
              {resumo?.variacao_media_percentual >= 0 ? <ArrowUpRight size={14} className="sm:w-4 sm:h-4" /> : <ArrowDownRight size={14} className="sm:w-4 sm:h-4" />}
              <span>{resumo?.variacao_media_percentual ? `${resumo.variacao_media_percentual.toFixed(1)}%` : '0%'}</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-3 lg:p-5 rounded-xl border transition-all duration-300 hover:shadow-lg`}>
            <span className="text-xs lg:text-sm font-semibold">Maior split</span>
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

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-3 lg:p-5 rounded-xl border transition-all duration-300 hover:shadow-lg`}>
            <span className="text-xs lg:text-sm font-semibold">Parceiros</span>
            <p className="text-lg lg:text-2xl font-bold mt-1">{resumo?.uniqueUsersCount ? resumo.uniqueUsersCount : '0'}</p>
            <p className="text-xs font-semibold mt-2">Ativos</p>
          </div>
        </div>

        {/* Chart */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-4 lg:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 lg:mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-1">Splits diários</h2>
              <p className="text-sm font-semibold">Acompanhe seus splits por dia</p>
            </div>
            <button className={`flex items-center gap-2 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg transition-colors`}>
              <span className="text-sm font-semibold">Última semana</span>
              <ChevronRight size={16} />
            </button>
          </div>
         
          <div className="h-[250px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid stroke={'#6B7280'} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#4B5563"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis
                  stroke="#4B5563"
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={value => `R$${(value/1000).toFixed(0)}k`}
                />
                 <Tooltip 
                  formatter={(value: number, name: string) => {
                  const labelMap: Record<string, string> = {
                  split: 'split',
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
                  dataKey="splits"
                  stroke="var(--primary-color)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--primary-color)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--primary-color)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg`}>
          <div className={`p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-100'} px-3 py-2 rounded-lg`}>
                <Search size={16} className="text-gray-400 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Buscar transação..."
                  className="bg-transparent border-none focus:outline-none text-xs sm:text-sm flex-1 placeholder-gray-500"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {transactions.map((transaction) => (
              <div key={transaction.transaction_id} className={`p-4 border-b  last:border-b-0`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">{transaction.description}</h3>
                    <p className="text-xs font-semibold">{transaction.transaction_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--primary-color)]">{transaction.amount}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold">{transaction.date}</p>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                  <th className="text-left p-4 text-sm font-medium ">Transaction ID</th>
                  <th className="text-left p-4 text-sm font-medium ">Descrição</th>
                  <th className="text-left p-4 text-sm font-medium">Valor</th>
                  <th className="text-left p-4 text-sm font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transaction_id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[var(--card-background)]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <td className="p-4">
                      <span className="text-sm font-medium">{transaction.transaction_id}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{transaction.description}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold text-[var(--primary-color)]">{transaction.amount}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{transaction.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {transactions.length === 0 && (
            <div className="p-8 text-center">
              <p className="">Nenhum split encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}