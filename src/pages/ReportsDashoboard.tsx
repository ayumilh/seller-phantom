import React, { useContext, useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Zap, 
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  AlertTriangle,
  Shield,
  Activity,
  Target,
  Users,
  Calendar,
  Filter,
  RefreshCw,
  Download
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { ThemeContext } from '../lib/theme';
import { PageHeader } from '../components/PageHeader';
import { dashboardService } from '../services/dashboardService';
import { Loading } from '../components/Loading';

export default function ReportsDashboard() {
  const { isDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    preset: '7d'
  });

  const datePresets = [
    { id: '7d', label: '7 dias', days: 7 },
    { id: '30d', label: '30 dias', days: 30 },
    { id: '90d', label: '90 dias', days: 90 },
    { id: '6m', label: '6 meses', days: 180 },
    { id: '1y', label: '1 ano', days: 365 },
    { id: 'ytd', label: 'Ano atual', days: null }
  ];

  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const initialFilter = {
      startDate: sevenDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      preset: '7d'
    };

    setDateFilter(initialFilter);
    fetchDashboardData(initialFilter.startDate, initialFilter.endDate);
  }, []);

  const fetchDashboardData = async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardReport(startDate, endDate);
      setData(response);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const calculateMargin = (entradas: number, saidas: number) => {
    return ((entradas - saidas) / entradas * 100).toFixed(1);
  };

  const handlePresetClick = (preset: any) => {
    const today = new Date();
    let startDate = new Date(today);

    if (preset.id === 'ytd') {
      startDate = new Date(today.getFullYear(), 0, 1);
    } else if (preset.days) {
      startDate.setDate(today.getDate() - preset.days);
    }

    const formattedStart = startDate.toISOString().split('T')[0];
    const formattedEnd = today.toISOString().split('T')[0];

    const updatedFilter = {
      startDate: formattedStart,
      endDate: formattedEnd,
      preset: preset.id
    };

    setDateFilter(updatedFilter);
    fetchDashboardData(formattedStart, formattedEnd);
  };

  const handleCustomDateChange = (field: string, value: string) => {
    const updated = {
      ...dateFilter,
      [field]: value,
      preset: 'custom'
    };

    setDateFilter(updated);
  };

  const applyFilter = () => {
    if (dateFilter.startDate && dateFilter.endDate) {
      fetchDashboardData(dateFilter.startDate, dateFilter.endDate);
    }
  };

  const resetFilter = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const reset = {
      startDate: sevenDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      preset: '7d'
    };

    setDateFilter(reset);
    fetchDashboardData(reset.startDate, reset.endDate);
  };

  const getDaysCount = () => {
    if (dateFilter.startDate && dateFilter.endDate) {
      const start = new Date(dateFilter.startDate);
      const end = new Date(dateFilter.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const getRiscoStatus = (margem: number) => {
  if (margem > 95) {
    return {
      nivel: 'Baixo',
      status: 'Status Saudável',
      cor: 'text-green-500',
      bg: 'bg-green-50',
      borda: 'border-green-500',
      descricao: 'Margem consistente e baixo índice de bloqueios',
    };
  } else if (margem >= 90) {
    return {
      nivel: 'Regular',
      status: 'Status Funcional',
      cor: 'text-yellow-500',
      bg: 'bg-yellow-50',
      borda: 'border-yellow-500',
      descricao: 'Margem aceitável, atenção a bloqueios crescentes',
    };
  } else {
    return {
      nivel: 'Alto',
      status: 'Status Deficiente',
      cor: 'text-red-500',
      bg: 'bg-red-50',
      borda: 'border-red-500',
      descricao: 'Margem crítica, alto índice de bloqueios',
    };
  }
};



  if (!data) return <Loading/>;

  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Análise completa do seu negócio"
      >
        <div className="flex items-center gap-2">
          <button className={`${isDarkMode ? 'bg-[var(--card-background)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-1.5 rounded-lg text-gray-400 transition-colors`}>
            <Download size={20} />
          </button>
        </div>
      </PageHeader>

      <div className="p-4 lg:p-8 space-y-6">
        {/* Filtros de Data */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-6 rounded-xl border`}>
          <div className="flex items-center gap-2 mb-6">
            <Filter className="text-[var(--primary-color)]" size={24} />
            <h3 className="text-lg font-semibold">Filtros de Período</h3>
            {dateFilter.startDate && dateFilter.endDate && (
              <span className="text-sm text-gray-400 ml-4">
                ({getDaysCount()} dias selecionados)
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Presets Rápidos */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Períodos Rápidos
              </label>
              <div className="flex flex-wrap gap-2">
                {datePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetClick(preset)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      dateFilter.preset === preset.id
                        ? 'bg-[var(--primary-color)] text-white'
                        : isDarkMode
                          ? 'bg-[var(--background-color)] text-gray-400 hover:bg-[var(--primary-color)]/10 hover:text-[var(--primary-color)]'
                          : 'bg-gray-100 text-gray-600 hover:bg-[var(--primary-color)]/10 hover:text-[var(--primary-color)]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção Manual de Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Data Inicial
                </label>
                <div className={`flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--background-color)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-[var(--primary-color)] px-3`}>
                  <Calendar size={16} className="text-gray-400" />
                  <input
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                    className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Data Final
                </label>
                <div className={`flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--background-color)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-[var(--primary-color)] px-3`}>
                  <Calendar size={16} className="text-gray-400" />
                  <input
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                    className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={applyFilter}
                disabled={loading || !dateFilter.startDate || !dateFilter.endDate}
                className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-10"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Aplicando...
                  </>
                ) : (
                  <>
                    <Filter size={16} />
                    Aplicar Filtro
                  </>
                )}
              </button>

              <button
                onClick={resetFilter}
                disabled={loading}
                className={`${isDarkMode ? 'bg-[var(--background-color)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} text-gray-400 px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-10`}
              >
                <RefreshCw size={16} />
                Reset
              </button>
            </div>

            {/* Informações do Período */}
            {dateFilter.startDate && dateFilter.endDate && (
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-[var(--primary-color)]" />
                  <span className="text-gray-400">Período selecionado:</span>
                  <span className="font-medium">
                    {new Date(dateFilter.startDate).toLocaleDateString('pt-BR')} até {new Date(dateFilter.endDate).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-[var(--primary-color)]">{getDaysCount()} dias</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cards Principais */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${loading ? 'opacity-60' : ''}`}>
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="text-green-500" size={20} />
              <span className="text-sm text-gray-400">Total Faturado</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(data.totalFaturado)}</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>0%</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="text-blue-500" size={20} />
              <span className="text-sm text-gray-400">Pagamentos Iniciados</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(data.totalPagamentosIniciados)}</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>0%</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Target className="text-[var(--primary-color)]" size={20} />
              <span className="text-sm text-gray-400">Ticket Médio</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(data.ticketMedio)}</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>0%</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-orange-500" size={20} />
              <span className="text-sm text-gray-400">Bloqueio Cautelar</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(data.totalBloqueiosCautelares)}</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>0%</span>
            </div>
          </div>
        </div>

        {/* Segunda linha de cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${loading ? 'opacity-60' : ''}`}>
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-emerald-500" size={20} />
              <span className="text-sm text-gray-400">Média Diária</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(data.mediaDiaria)}</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>0%</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Users className="text-pink-500" size={20} />
              <span className="text-sm text-gray-400">Quantidade de Transações</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(data.quantidadeTransacoes)}</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>0%</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-indigo-500" size={20} />
              <span className="text-sm text-gray-400">Taxa de Aprovação</span>
            </div>
            <p className="text-2xl font-bold">100%</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>0%</span>
            </div>
          </div>
        </div>

        {/* Gráficos Principais */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${loading ? 'opacity-60' : ''}`}>
          {/* Gráfico de Pagamentos por Dia */}
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-6 rounded-xl border`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Pagamentos Gerados</h3>
                <p className="text-sm text-gray-400">Evolução diária dos pagamentos</p>
              </div>
              <BarChart3 className="text-[var(--primary-color)]" size={24} />
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.pagamentosPorDia}>
                  <CartesianGrid stroke={isDarkMode ? '#1E1E2E' : '#f0f0f0'} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280" 
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      const labelMap: Record<string, string> = {
                        valor: 'Valor',
                        pagamentos: 'Pagamentos'
                      };

                      const formattedValue =
                        name === 'Valor'
                          ? new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(value)
                          : value;

                      return [formattedValue, labelMap[name] || name];
                    }}
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1E1E2E' : '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    name="Valor"
                    stroke="var(--primary-color)"
                    fill="var(--primary-color)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pagamentos" 
                    name="Pagamentos" 
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Saque vs Depósito */}
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-6 rounded-xl border`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Saque vs Depósito</h3>
                <p className="text-sm text-gray-400">Comparativo de entradas e saídas</p>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.saqueDepositoData}>
                  <CartesianGrid stroke={isDarkMode ? '#1E1E2E' : '#f0f0f0'} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280" 
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
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
                      backgroundColor: isDarkMode ? '#1E1E2E' : '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="depositos" fill="#22C55E" name="Depósitos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saques" fill="#EF4444" name="Saques" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Lista Gráfica com Barras de % */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-6 rounded-xl border ${loading ? 'opacity-60' : ''}`}>
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-[var(--primary-color)]" size={24} />
            <h3 className="text-lg font-semibold">Métricas de Performance</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.conversaoData.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className={`text-sm font-bold ${item.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                    {item.isNegative ? `${item.value}%` : `${item.value}%`}
                  </span>
                </div>
                <div className="w-full bg-gray-700/20 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.isNegative ? item.value * 10 : item.value}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-400">
                    {item.isNegative ? 'Reduzir para < 2%' : 'Meta: 95%'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Risco do Negócio */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-6 rounded-xl border ${loading ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={24} />
                Análise de Risco do Negócio
              </h3>
              <p className="text-sm text-gray-400">Entradas vs Saídas e Bloqueios Cautelares</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico de Margem */}
            <div className="lg:col-span-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.riscoData}>
                    <CartesianGrid stroke={isDarkMode ? '#1E1E2E' : '#f0f0f0'} strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      stroke="#6B7280" 
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#6B7280" 
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
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
                        backgroundColor: isDarkMode ? '#1E1E2E' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        color: isDarkMode ? '#ffffff' : '#000000'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="entradas" 
                      stroke="#22C55E" 
                      strokeWidth={3}
                      name="Entradas"
                      dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="saidas" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      name="Saídas"
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Métricas de Risco */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'}`}>
                <div className="text-sm text-gray-400 mb-1">Margem Média</div>
                <div className="text-2xl font-bold text-green-500">
                  {calculateMargin(
                    data.riscoData.reduce((acc, item) => acc + item.qtd_entradas, 0),
                    data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)
                  )}%
                </div>
                <div className="text-xs text-gray-400 mt-1">Últimos 6 meses</div>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'}`}>
                <div className="text-sm text-gray-400 mb-1">Bloqueios Totais</div>
                <div className="text-2xl font-bold text-orange-500">
                  {data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">Últimos 6 meses</div>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'}`}>
                <div className="text-sm text-gray-400 mb-1">Risco Atual</div>
                <div className={`text-2xl font-bold ${
                  getRiscoStatus(calculateMargin(
                    data.riscoData.reduce((acc, item) => acc + item.qtd_entradas, 0),
                    data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)
                  )).cor
                }`}>
                  {
                    getRiscoStatus(calculateMargin(
                      data.riscoData.reduce((acc, item) => acc + item.qtd_entradas, 0),
                      data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)
                    )).nivel
                  }
                </div>
                <div className="text-xs text-gray-400 mt-1">Baseado na análise</div>
              </div>

              <div className={`p-4 rounded-lg border-l-4 ${
                getRiscoStatus(calculateMargin(
                  data.riscoData.reduce((acc, item) => acc + item.qtd_entradas, 0),
                  data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)
                )).borda
              } ${
                isDarkMode
                  ? ''
                  : getRiscoStatus(calculateMargin(
                      data.riscoData.reduce((acc, item) => acc + item.qtd_entradas, 0),
                      data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)
                    )).bg
              }`}>
                <div className={`text-sm font-medium ${
                  getRiscoStatus(calculateMargin(
                    data.riscoData.reduce((acc, item) => acc + item.qtd_entradas, 0),
                    data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)
                  )).cor
                } mb-1`}>
                  {
                    getRiscoStatus(calculateMargin(
                      data.riscoData.reduce((acc, item) => acc + item.qtd_entradas, 0),
                      data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)
                    )).status
                  }
                </div>
                <div className="text-xs text-gray-400">
                  {
                    getRiscoStatus(calculateMargin(
                      data.riscoData.reduce((acc, item) => acc + item.qtd_entradas, 0),
                      data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)
                    )).descricao
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}