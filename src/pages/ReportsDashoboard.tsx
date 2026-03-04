import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormatCurrency } from '../hooks/useFormatCurrency';
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
  const intl = useIntl();
  const formatCurrency = useFormatCurrency();
  const { isDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    preset: '7d'
  });

  const datePresets = [
    { id: '7d', days: 7 },
    { id: '30d', days: 30 },
    { id: '90d', days: 90 },
    { id: '6m', days: 180 },
    { id: '1y', days: 365 },
    { id: 'ytd', days: null }
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

  const formatNumber = (value: number) => intl.formatNumber(value);

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
      nivel: intl.formatMessage({ id: 'reports.risk.low' }),
      status: intl.formatMessage({ id: 'reports.risk.healthy' }),
      cor: 'text-green-500',
      bg: 'bg-green-50',
      borda: 'border-green-500',
      descricao: intl.formatMessage({ id: 'reports.risk.healthyDescription' }),
    };
  } else if (margem >= 90) {
    return {
      nivel: intl.formatMessage({ id: 'reports.risk.medium' }),
      status: intl.formatMessage({ id: 'reports.risk.functional' }),
      cor: 'text-yellow-500',
      bg: 'bg-yellow-50',
      borda: 'border-yellow-500',
      descricao: intl.formatMessage({ id: 'reports.risk.functionalDescription' }),
    };
  } else {
    return {
      nivel: intl.formatMessage({ id: 'reports.risk.high' }),
      status: intl.formatMessage({ id: 'reports.risk.critical' }),
      cor: 'text-red-500',
      bg: 'bg-red-50',
      borda: 'border-red-500',
      descricao: intl.formatMessage({ id: 'reports.risk.criticalDescription' }),
    };
  }
};



  if (!data) return <Loading/>;

  return (
    <>
      <PageHeader
        title={intl.formatMessage({ id: 'reports.title' })}
        description={intl.formatMessage({ id: 'reports.description' })}
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
            <h3 className="text-lg font-semibold">{intl.formatMessage({ id: 'reports.filters' })}</h3>
            {dateFilter.startDate && dateFilter.endDate && (
              <span className="text-sm text-gray-400 ml-4">
                ({intl.formatMessage({ id: 'reports.daysSelected' }, { count: getDaysCount() })})
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Presets Rápidos */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                {intl.formatMessage({ id: 'reports.quickPeriods' })}
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
                    {intl.formatMessage({ id: `reports.preset.${preset.id}` })}
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção Manual de Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {intl.formatMessage({ id: 'reports.dateStart' })}
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
                  {intl.formatMessage({ id: 'reports.dateEnd' })}
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
                    {intl.formatMessage({ id: 'dashboard.apply' })}...
                  </>
                ) : (
                  <>
                    <Filter size={16} />
                    {intl.formatMessage({ id: 'dashboard.apply' })}
                  </>
                )}
              </button>

              <button
                onClick={resetFilter}
                disabled={loading}
                className={`${isDarkMode ? 'bg-[var(--background-color)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} text-gray-400 px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-10`}
              >
                <RefreshCw size={16} />
                {intl.formatMessage({ id: 'dashboard.clear' })}
              </button>
            </div>

            {/* Informações do Período */}
            {dateFilter.startDate && dateFilter.endDate && (
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-[var(--primary-color)]" />
                  <span className="text-gray-400">{intl.formatMessage({ id: 'reports.selectedPeriod' })}</span>
                  <span className="font-medium">
                    {intl.formatDate(dateFilter.startDate, { dateStyle: 'medium' })} {intl.formatMessage({ id: 'reports.periodUntil' })} {intl.formatDate(dateFilter.endDate, { dateStyle: 'medium' })}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-[var(--primary-color)]">{getDaysCount()} {intl.formatMessage({ id: 'reports.days' })}</span>
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
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'reports.totalBilled' })}</span>
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
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'reports.startedPayments' })}</span>
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
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'wallet.averageTicket' })}</span>
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
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'reports.cautionaryBlock' })}</span>
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
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'reports.dailyAverage' })}</span>
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
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'reports.transactionsCount' })}</span>
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
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'reports.approvalRate' })}</span>
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
                <h3 className="text-lg font-semibold mb-1">{intl.formatMessage({ id: 'reports.generatedPayments' })}</h3>
                <p className="text-sm text-gray-400">{intl.formatMessage({ id: 'reports.dailyPaymentsEvolution' })}</p>
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
                    tickFormatter={(v) => (v ? intl.formatDate(v, { month: 'short', day: 'numeric' }) : v)}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string, props: { dataKey?: string }) => {
                      const dataKey = props?.dataKey;
                      const labelMap: Record<string, string> = {
                        valor: intl.formatMessage({ id: 'reports.chart.value' }),
                        pagamentos: intl.formatMessage({ id: 'reports.chart.payments' })
                      };

                      const formattedValue =
                        dataKey === 'valor'
                          ? formatCurrency(value)
                          : value;

                      return [formattedValue, labelMap[dataKey || ''] || name];
                    }}
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1E1E2E' : '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                    labelFormatter={(label) => (label ? intl.formatDate(label, { dateStyle: 'medium' }) : label)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    name={intl.formatMessage({ id: 'reports.chart.value' })}
                    stroke="var(--primary-color)"
                    fill="var(--primary-color)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pagamentos" 
                    name={intl.formatMessage({ id: 'reports.chart.payments' })} 
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
                <h3 className="text-lg font-semibold mb-1">{intl.formatMessage({ id: 'reports.withdrawVsDeposit' })}</h3>
                <p className="text-sm text-gray-400">{intl.formatMessage({ id: 'reports.incomeOutcomeComparison' })}</p>
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
                    tickFormatter={(v) => (v ? intl.formatDate(v, { month: 'short', day: 'numeric' }) : v)}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string, props: { dataKey?: string }) => {
                      const dataKey = props?.dataKey;
                      const labelMap: Record<string, string> = {
                      depositos: intl.formatMessage({ id: 'reports.chart.deposits' }),
                      saques: intl.formatMessage({ id: 'reports.chart.withdrawals' })
                      };
                      return [
                      formatCurrency(value),
                      labelMap[dataKey || ''] || name
                      ];
                    }}
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1E1E2E' : '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                    labelFormatter={(label) => (label ? intl.formatDate(label, { dateStyle: 'medium' }) : label)}
                  />
                  <Legend />
                  <Bar dataKey="depositos" fill="#22C55E" name={intl.formatMessage({ id: 'reports.chart.deposits' })} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saques" fill="#EF4444" name={intl.formatMessage({ id: 'reports.chart.withdrawals' })} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Lista Gráfica com Barras de % */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-6 rounded-xl border ${loading ? 'opacity-60' : ''}`}>
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-[var(--primary-color)]" size={24} />
            <h3 className="text-lg font-semibold">{intl.formatMessage({ id: 'reports.performanceMetrics' })}</h3>
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
                {intl.formatMessage({ id: 'reports.businessRiskAnalysis' })}
              </h3>
              <p className="text-sm text-gray-400">{intl.formatMessage({ id: 'reports.incomeOutcomeAndBlocks' })}</p>
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
                      tickFormatter={(v) => (v ? intl.formatDate(v, { month: 'short' }) : v)}
                    />
                    <YAxis 
                      stroke="#6B7280" 
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string, props: { dataKey?: string }) => {
                        const dataKey = props?.dataKey;
                        const labelMap: Record<string, string> = {
                        entradas: intl.formatMessage({ id: 'reports.chart.income' }),
                        saidas: intl.formatMessage({ id: 'reports.chart.outcome' })
                        };
                        return [
                        formatCurrency(value),
                        labelMap[dataKey || ''] || name
                        ];
                      }}
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#1E1E2E' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        color: isDarkMode ? '#ffffff' : '#000000'
                      }}
                      labelFormatter={(label) => (label ? intl.formatDate(label, { month: 'short' }) : label)}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="entradas" 
                      stroke="#22C55E" 
                      strokeWidth={3}
                      name={intl.formatMessage({ id: 'reports.chart.income' })}
                      dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="saidas" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      name={intl.formatMessage({ id: 'reports.chart.outcome' })}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Métricas de Risco */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'}`}>
                <div className="text-sm text-gray-400 mb-1">{intl.formatMessage({ id: 'reports.averageMargin' })}</div>
                <div className="text-2xl font-bold text-green-500">
                  {calculateMargin(
                    data.riscoData.reduce((acc, item) => acc + item.qtd_entradas, 0),
                    data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)
                  )}%
                </div>
                <div className="text-xs text-gray-400 mt-1">{intl.formatMessage({ id: 'reports.last6Months' })}</div>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'}`}>
                <div className="text-sm text-gray-400 mb-1">{intl.formatMessage({ id: 'reports.totalBlocks' })}</div>
                <div className="text-2xl font-bold text-orange-500">
                  {data.riscoData.reduce((acc, item) => acc + item.bloqueios, 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">{intl.formatMessage({ id: 'reports.last6Months' })}</div>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'}`}>
                <div className="text-sm text-gray-400 mb-1">{intl.formatMessage({ id: 'reports.currentRisk' })}</div>
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
                <div className="text-xs text-gray-400 mt-1">{intl.formatMessage({ id: 'reports.basedOnAnalysis' })}</div>
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