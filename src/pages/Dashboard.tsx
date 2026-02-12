import React, { useEffect, useState, useId } from 'react';
import { Wallet, TrendingUp, DollarSign, Target, Clock, Calendar, Award, CheckCircle, X } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
// Tema escuro fixo, sem alternância
import { dashboardService } from '../services/dashboardService';
import { utilsservice } from '../services/utilsService';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components/Loading';
import logo from '../../dist/assets/logo.png';
import { computeAwards } from '../lib/awards';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

// UI helpers (apenas visual) - estilo de card mais atual (glass + lift)
const Card = ({ title, right, children }: { title?: string; right?: React.ReactNode; children: React.ReactNode }) => (
  <div
    className="group rounded-3xl p-5 border relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
    style={{
      background: 'linear-gradient(180deg, rgba(20,21,23,0.92) 0%, rgba(20,21,23,0.86) 100%)',
      borderColor: 'rgba(255,255,255,0.06)'
    }}
  >
    {/* brilho superior */}
    <span className="pointer-events-none absolute inset-x-0 -top-8 h-12" style={{ background: 'radial-gradient(80% 50% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)' }} />
    {/* acentos nos cantos */}
    <span className="pointer-events-none absolute -right-10 -top-10 w-36 h-36 rounded-full blur-2xl opacity-20" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
    <span className="pointer-events-none absolute -left-10 -bottom-10 w-36 h-36 rounded-full blur-2xl opacity-10" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />

    {(title || right) && (
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-white/5">
        {title ? <h3 className="text-base font-semibold text-white/90">{title}</h3> : <div />}
        {right}
      </div>
    )}
    {children}
  </div>
);

// Chip de ícone circular com anel e brilho sutil
const IconChip = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex items-center justify-center text-white">
    <div className="size-11 rounded-full grid place-items-center relative overflow-hidden">
      <span className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-light) 100%)', border: '1px solid rgba(255,255,255,0.08)' }} />
      <span className="absolute -inset-[1.5px] rounded-full opacity-60" style={{ border: '1px solid var(--shadow-color)' }} />
      <span className="relative z-10">{children}</span>
    </div>
  </div>
);

const StatsCard = ({
  icon,
  label,
  value,
  delta,
  sparkData,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  delta?: React.ReactNode;
  sparkData?: number[];
}) => {
  const id = useId();
  const data = (sparkData || []).map((v, i) => ({ x: i, y: v }));
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <IconChip>{icon}</IconChip>
          <div>
            <div className="text-xs text-white/60">{label}</div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
          </div>
        </div>
        {delta && (
          <div className="text-[10px] font-medium px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            {delta}
          </div>
        )}
      </div>
      {data.length > 0 && (
        <div className="hidden md:block mt-3">
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 0, right: 0, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id={`spark_${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-color)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary-color)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="y" stroke="var(--primary-color)" strokeWidth={2.5} fill={`url(#spark_${id})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
};

// Gauge semicírculo com gradiente (estilo do exemplo)
const GaugeProgress = ({ title, paid, total }: { title: string; paid?: number; total?: number }) => {
  const id = useId();
  const paidValue = paid ?? 0;
  const totalValue = total ?? 0;
  const percent = totalValue > 0 ? Math.max(0, Math.min(100, (paidValue / totalValue) * 100)) : 0;

  const stroke = 16;
  const r = 92.5;
  const cx = 200;
  const cy = 200;
  const circumference = 2 * Math.PI * r;
  const half = circumference / 2; // semicírculo
  const dashOffset = half * (1 - percent / 100);

  return (
    <Card title={title}>
      <div className="relative h-56 flex items-center justify-center">
        <div className="relative" style={{ height: 200, width: 200 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="100 100 200 200" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
            <defs>
              <linearGradient id={`grd_${id}`} x1="0%" y1="0%" x2="0%" y2="100%" gradientTransform="rotate(90, .5, .5)">
                <stop offset="0%" stopColor="var(--primary-color)" />
                <stop offset="100%" stopColor="var(--primary-color)" />
              </linearGradient>
            </defs>
            {/* trilho */}
            <circle cx={cx} cy={cy} r={r} stroke="#22242A" strokeWidth={stroke} fill="none" strokeDasharray={`${half} ${circumference}`} strokeLinecap="round" />
            {/* progresso */}
            <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth={stroke} strokeDasharray={`${half} ${circumference}`} strokeDashoffset={dashOffset} strokeLinecap="round" stroke={`url(#grd_${id})`} style={{ transition: 'stroke-dashoffset 400ms ease' }} />
          </svg>

          {/* label central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-extrabold">{percent.toFixed(0)}%</div>
              <div className="text-xs text-white/60 -mt-0.5">Conversão</div>
            </div>
          </div>
        </div>

        {/* faixa inferior com 0% e 100% */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur border border-white/10 flex items-center gap-8">
          <span className="text-xs text-white/60">0%</span>
          <div className="text-base font-semibold">{percent.toFixed(0)}%</div>
          <span className="text-xs text-white/60">100%</span>
        </div>
      </div>

      {/* legenda valores */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--primary-color)]"></div>
            <span>Pagos</span>
          </div>
          <span className="font-medium">{utilsservice.formatarParaReal(paidValue)}</span>
        </div>
        <div className="flex items-center justify-between text-sm opacity-70">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/40"></div>
            <span>Total</span>
          </div>
          <span className="font-medium">{utilsservice.formatarParaReal(totalValue)}</span>
        </div>
      </div>
    </Card>
  );
};


// Componente para barra de progresso de recompensas (com placas por marco)
const RewardsProgress = ({ currentRevenue }: { currentRevenue: number }) => {
  const { milestones, next, achieved, percent } = computeAwards(currentRevenue);

  return (
    <Card title="Programa de Recompensas" right={<Award size={18} style={{ color: 'var(--primary-color)' }} />}>
      <div className="flex flex-col min-h-[340px]">
        {/* Placa do marco (maior) */}
        <div className="flex-1 flex items-center justify-center">
          <img src={achieved.img} alt={achieved.label} className="h-80 md:h-88 object-contain drop-shadow" />
        </div>

        {/* Infos e barra no rodapé do card */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/80">Meta: {next.label}</span>
            <span className="text-sm">{utilsservice.formatarParaReal(currentRevenue)}</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              title={utilsservice.formatarParaReal(currentRevenue)}
              style={{ width: `${percent}%`, background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--primary-color) 100%)' }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-white/50 mt-2">
            <span>0</span>
            <span>{utilsservice.formatarParaReal(next.amount)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}; 

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setFinancialStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  // Popup de comunicado (mostra 1x a cada 24h)
  const [showComunicado, setShowComunicado] = useState(false);
  // Header/Filtro
  const [showFilter, setShowFilter] = useState(false);
  // Filtro por data (apenas alguns cards)
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [filtered, setFiltered] = useState<{
    paymentsGenerated?: number;
    dailyRevenue?: number;
    pix?: { paid?: number; total?: number; pending?: number };
  } | null>(null);

  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [revenueByHour, setRevenueByHour] = useState([]);
  const [pixConversion, setPixConversion] = useState({ paid: 0, total: 0, pending: 0 });

  const fetchWeeklyRevenue = async () => {
    try {
      const data = await dashboardService.getWeeklyRevenue();
      setWeeklyRevenue(data.data);
    } catch (error) {
      console.error("Erro ao buscar faturamento semanal:", error);
    }
  };

  const fetchRevenueByHour = async () => {
    try {
      const data = await dashboardService.getHourlyRevenue();
      setRevenueByHour(data.data);
    } catch (error) {
      console.error("Erro ao buscar faturamento por horário:", error);
    }
  };

  const fetchPixConversion = async () => {
    try {
      const data = await dashboardService.getPixConversion();
      setPixConversion(data.data);
    } catch (error) {
      console.error("Erro ao buscar conversão via PIX:", error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const [statsRes] = await Promise.all([
        dashboardService.getFinancialStats(),
      ]);

      if (!statsRes.error) setFinancialStats(statsRes.data);

      setLoading(false);
    };

    fetchDashboardData();
    fetchWeeklyRevenue();
    fetchRevenueByHour();
    fetchPixConversion();
    // Controle de exibição 1x a cada 24h
    const KEY = 'keyclub_notice_last_shown_at';
    try {
      const last = localStorage.getItem(KEY);
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      if (!last || now - Number(last) >= dayMs) {
        setShowComunicado(true);
        localStorage.setItem(KEY, String(now));
      }
    } catch (e) {
      setShowComunicado(true);
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Cabeçalho com título/saudação e botão do filtro */}
      <div className="flex flex-row items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-white/60">Seja bem vindo, {(() => {
            const u = (localStorage.getItem('username') || '').trim();
            if (!u) return 'Usuário';
            return u.split(' ')[0];
          })()}!</p>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={() => setShowFilter(v => !v)}
            className="h-10 px-4 rounded-lg flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10"
            aria-expanded={showFilter}
            aria-controls="dashboard-filter-panel"
          >
            <Calendar size={16} className="text-[var(--primary-color)]" />
            {showFilter ? 'Fechar filtro' : 'Abrir filtro'}
          </button>
        </div>
      </div>

      {/* Painel do filtro (condicional) */}
      {showFilter && (
        <div id="dashboard-filter-panel" className="rounded-2xl border border-white/10 bg-[var(--card-background)]/95 p-4 lg:p-5">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs text-white/60 mb-1">Início</label>
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-white/60 mb-1">Fim</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  try {
                    const res: any = await dashboardService.getDashboardReport(startDate, endDate);
                    const data = res?.data ?? res; // tolerante ao shape
                    const pg = Number(data?.paymentsGenerated ?? data?.payments_count ?? data?.payments);
                    const dr = Number(data?.dailyRevenue ?? data?.revenue ?? data?.totalRevenue);
                    const pix = data?.pixConversion || data?.pix || { paid: data?.pixPaid, total: data?.pixTotal, pending: data?.pixPending };
                    setFiltered({
                      paymentsGenerated: isNaN(pg) ? undefined : pg,
                      dailyRevenue: isNaN(dr) ? undefined : dr,
                      pix: pix || undefined,
                    });
                  } catch (e) {
                    console.error('Falha ao aplicar filtro', e);
                  }
                }}
                className="h-10 px-4 rounded-lg bg-[var(--primary-color)] text-white hover:opacity-90 transition"
              >
                Aplicar
              </button>
              <button
                onClick={() => setFiltered(null)}
                className="h-10 px-4 rounded-lg bg-white/5 text-white hover:bg-white/10 transition"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Comunicado Oficial (1x a cada 24h) */}
      {showComunicado && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowComunicado(false)} />
          {/* Conteúdo */}
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[var(--card-background)]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
            {/* Glow/gradiente top */}
            <span className="pointer-events-none absolute left-0 right-0 top-0 h-20 rounded-t-2xl" style={{ background: 'linear-gradient(180deg, var(--primary-color)10 0%, transparent 100%)' }} />
            {/* Gradientes internos (decorativos) */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl"
                 style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
            <div className="pointer-events-none absolute bottom-[-25%] left-[-20%] w-56 h-56 rounded-full blur-3xl opacity-20"
                 style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
            {/* Botão fechar */}
            <button onClick={() => setShowComunicado(false)} className="absolute top-3 right-3 p-2 rounded-lg hover:bg-white/5" aria-label="Fechar">
              <X size={18} />
            </button>
            {/* Logo */}
            <div className="relative w-fit mx-auto my-4 z-10">
              <img src={logo} alt="KEYCLUB" className="w-20 h-auto object-contain" />
            </div>
            {/* Título */}
            <h3 className="text-2xl leading-8 font-bold text-center text-white">Comunicado Oficial</h3>
            {/* Texto */}
            <div className="space-y-3 my-5 mx-auto px-5 max-w-[95%] sm:max-w-[85%] leading-relaxed text-white/90 text-sm">
              <p>Prezados Parceiros,</p>
              <p>O Banco Central anunciou, nesta sexta-feira (05/09/2025), o reforço das medidas de segurança aplicáveis às operações realizadas via Pix.</p>
              <p>A nova regulamentação estabelece limite de <strong>R$ 15.000,00 (quinze mil reais)</strong> por transação para operações efetuadas por instituições de pagamento não autorizadas diretamente pelo BC, bem como para aquelas que utilizam conexão ao Sistema Financeiro Nacional por meio de Prestadores de Serviços de Tecnologia da Informação (PSTIs).</p>
              <p>Dessa forma, informamos que, a partir das <strong>21h de hoje (05/09/2025)</strong>, todas as transações realizadas via Pix estarão limitadas ao valor máximo de R$ 15.000,00 por operação.</p>
              <p>Agradecemos pela compreensão e permanecemos à disposição para eventuais esclarecimentos.</p>
              <p className="mt-2 opacity-80 text-xs">Atenciosamente,<br/>Equipe KEYCLUB</p>
            </div>
            {/* Ações */}
            <div className="flex items-center justify-center gap-3 pb-4 pt-1">
              <button type="button" onClick={() => setShowComunicado(false)} className="rounded-lg h-9 px-4 flex items-center justify-center gap-2 text-sm font-medium bg-[var(--primary-color)] text-white hover:opacity-90 active:scale-95 transition">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Primeira linha - Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Saldo Total - Destaque */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <IconChip>
                  <Wallet size={18} />
                </IconChip>
                <div>
                  <div className="text-xs text-white/60">Saldo Total</div>
                  <div className="mt-1 text-3xl font-semibold">{stats?.balance ? utilsservice.formatarParaReal(Number(stats.balance)) : <span>—</span>}</div>
                </div>
              </div>
              <div className="text-xs text-emerald-400 font-medium">{stats?.balanceGrowth || '-'}</div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => navigate('/sacar')} className="px-4 h-10 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[color:var(--primary-dark)] transition-colors">Sacar</button>
              <button onClick={() => navigate('/relatorios/entradas')} className="px-4 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">Ver extrato</button>
            </div>
          </Card>
        </div>

        {/* Total de Vendas */}
        <StatsCard
          icon={<TrendingUp size={18} className="text-white" />}
          label="Total de Vendas"
          value={(filtered?.paymentsGenerated ?? stats?.paymentsGenerated) ?? '—'}
          delta={<><CheckCircle size={12} className="inline mr-1" />{stats?.paymentsGrowth || '-'}</>}
          sparkData={weeklyRevenue.map((d: any) => d.revenue)}
        />

        {/* Faturamento Hoje */}
        <StatsCard
          icon={<DollarSign size={18} className="text-white" />}
          label="Faturamento Hoje"
          value={(filtered?.dailyRevenue != null
            ? utilsservice.formatarParaReal(Number(filtered.dailyRevenue))
            : (stats?.dailyRevenue ? utilsservice.formatarParaReal(Number(stats.dailyRevenue)) : '—'))}
          delta={stats?.revenueGrowth || '-'}
          sparkData={weeklyRevenue.map((d: any) => d.revenue)}
        />

        {/* Ticket Médio */}
        <StatsCard
          icon={<Target size={18} className="text-white" />}
          label="Ticket Médio"
          value={(() => {
            const dr = filtered?.dailyRevenue ?? (stats?.dailyRevenue != null ? Number(stats.dailyRevenue) : null);
            const pg = filtered?.paymentsGenerated ?? (stats?.paymentsGenerated != null ? Number(stats.paymentsGenerated) : null);
            if (dr == null || pg == null || Number(pg) <= 0) return '—';
            return utilsservice.formatarParaReal(Number(dr) / Number(pg));
          })()}
          sparkData={weeklyRevenue.map((d: any) => d.revenue)}
        />
      </div>

      {/* Segunda linha - Gráficos circulares e barra de progresso */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge PIX */}
        <GaugeProgress
          title="Conversão PIX"
          paid={(filtered?.pix?.paid ?? pixConversion?.paid) || undefined}
          total={(filtered?.pix?.total ?? pixConversion?.total) || undefined}
        />

        {/* Gauge Cartão */}
        <GaugeProgress
          title="Conversão Cartão"
          paid={stats?.cardPaid || undefined}
          total={stats?.cardTotal || undefined}
        />

        {/* Barra de Progresso de Recompensas */}
        <RewardsProgress 
          currentRevenue={Number(stats?.totalRevenue) || 350000}
        />
      </div>

      {/* Terceira linha - Gráfico de receita (últimos 7 dias) */}
      <div className={`bg-[var(--card-background)] border-white/5 p-6 rounded-xl border`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Receita (últimos 7 dias)</h3>
        </div>
        <div className="h-[300px]">
          {weeklyRevenue?.length ? (
            <ReactApexChart
              type="area"
              height="100%"
              options={{
                chart: { toolbar: { show: false }, foreColor: '#9CA3AF', background: 'transparent' },
                grid: { borderColor: '#374151', strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 3, colors: ['var(--primary-color)'] },
                fill: {
                  type: 'gradient',
                  gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0, stops: [0, 100], colorStops: [] },
                  colors: ['var(--primary-color)']
                },
                tooltip: { theme: 'dark', y: { formatter: (val: number) => utilsservice.formatarParaReal(Number(val)) } },
                xaxis: { categories: weeklyRevenue.map((d: any) => d.day), axisBorder: { show: false }, axisTicks: { show: false } },
                yaxis: { labels: { formatter: (val: number) => utilsservice.formatarParaReal(Number(val)) } },
                markers: { size: 0, hover: { sizeOffset: 2 } },
              } as ApexOptions}
              series={[{ name: 'Receita', data: weeklyRevenue.map((d: any) => d.revenue) }]}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Dados do gráfico indisponíveis</p>
            </div>
          )}
        </div>
      </div>

      {/* Quarta linha - Gráficos pequenos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faturamento por dias da semana */}
        <div className={`bg-[var(--card-background)] border-white/5 p-6 rounded-xl border`}>
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={20} className="text-[var(--primary-color)]" />
            <h3 className="text-lg font-semibold">Faturamento Semanal</h3>
          </div>
          <div className="h-[200px]">
            <ReactApexChart
              type="bar"
              height="100%"
              options={{
                chart: { toolbar: { show: false }, foreColor: '#9CA3AF', background: 'transparent' },
                grid: { borderColor: '#374151', strokeDashArray: 3 },
                plotOptions: { bar: { columnWidth: '48%', borderRadius: 6 } },
                dataLabels: { enabled: false },
                colors: ['var(--primary-color)'],
                xaxis: { categories: weeklyRevenue.map((d: any) => d.day), axisBorder: { show: false }, axisTicks: { show: false } },
                yaxis: { labels: { formatter: (val: number) => utilsservice.formatarParaReal(Number(val)) } },
                tooltip: { theme: 'dark', y: { formatter: (val: number) => utilsservice.formatarParaReal(Number(val)) } },
                states: { hover: { filter: { type: 'lighten', value: 0.1 } } },
              } as ApexOptions}
              series={[{ name: 'Faturamento', data: weeklyRevenue.map((d: any) => d.revenue) }]}
            />
          </div>
        </div>

        {/* Faturamento por horas do dia */}
        <div className={`bg-[var(--card-background)] border-white/5 p-6 rounded-xl border`}>
          <div className="flex items-center gap-3 mb-4">
            <Clock size={20} className="text-[var(--primary-color)]" />
            <h3 className="text-lg font-semibold">Faturamento por Horário</h3>
          </div>
          <div className="h-[200px]">
            <ReactApexChart
              type="line"
              height="100%"
              options={{
                chart: { toolbar: { show: false }, foreColor: '#9CA3AF', background: 'transparent' },
                grid: { borderColor: '#374151', strokeDashArray: 3 },
                stroke: { curve: 'smooth', width: 3, colors: ['#22c55e'] },
                dataLabels: { enabled: false },
                markers: { size: 4, colors: ['#22c55e'], strokeColors: '#22c55e', strokeWidth: 2, hover: { sizeOffset: 2 } },
                xaxis: { categories: revenueByHour.map((d: any) => d.hour), axisBorder: { show: false }, axisTicks: { show: false } },
                yaxis: { labels: { formatter: (val: number) => utilsservice.formatarParaReal(Number(val)) } },
                tooltip: { theme: 'dark', y: { formatter: (val: number) => utilsservice.formatarParaReal(Number(val)) } },
              } as ApexOptions}
              series={[{ name: 'Faturamento', data: revenueByHour.map((d: any) => d.revenue) }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}