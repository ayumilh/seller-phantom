import React, { useEffect, useState } from 'react';
import { utilsservice } from '../services/utilsService';
import { withdrawService } from '../services/withdrawService';
import { dashboardService } from '../services/dashboardService';
// no route navigation needed; subtabs are internal
import DepositMoney from './DepositMoney';
import WithdrawMoney from './WithdrawMoney';
import CryptoWithdraw from './CryptoWithdraw';
import InternalTransfer from './InternalTransfer';
import { Wallet as WalletIcon, TrendingUp, Clock, Target, DollarSign, Receipt } from 'lucide-react';

// Card visual igual ao Dashboard (glass + lift)
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    className="group rounded-3xl p-3 sm:p-4 md:p-5 border relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
    style={{
      background: 'linear-gradient(180deg, rgba(20,21,23,0.92) 0%, rgba(20,21,23,0.86) 100%)',
      borderColor: 'rgba(255,255,255,0.06)'
    }}
  >
    <span className="pointer-events-none absolute inset-x-0 -top-8 h-12" style={{ background: 'radial-gradient(80% 50% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)' }} />
    <div className="mb-3 md:mb-4 flex items-center justify-between pb-2 md:pb-3 border-b border-white/5">
      <h3 className="text-sm md:text-base font-semibold text-white/90">{title}</h3>
    </div>
    {children}
  </div>
);

export default function Wallet() {
  const [activeTab, setActiveTab] = useState<'saldo'|'depositar'|'pix'|'cripto'|'interna'>('saldo');
  const [balance, setBalance] = useState<number | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [txLoading, setTxLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  useEffect(() => {
    const load = async () => {
      try {
        const data = await withdrawService.getBalanceUser();
        setBalance(Number(data.balance ?? 0));
      } catch (e) {
        setBalance(0);
      }
    };
    const loadStats = async () => {
      try {
        const res = await dashboardService.getFinancialStats();
        if (!res.error) setStats(res.data);
      } catch {}
    };
    load();
    loadStats();
    fetchCompleted(1);
  }, []);

  async function fetchCompleted(p: number) {
    try {
      setTxLoading(true);
      const res = await withdrawService.getReportTransactions({ status: 'COMPLETED', pagination: { page: p, limit } });
      setTransactions(res.transactions || []);
      setTotalPages(res.totalPages || 1);
      setPage(p);
    } catch (e) {
      // silent
    } finally {
      setTxLoading(false);
    }
  }

  async function fetchReceipt(transactionId: any) {
    try {
      const data = await withdrawService.getReceipt(transactionId);
      setReceiptData(data);
      setReceiptOpen(true);
    } catch (e) {
      // silent
    }
  }

  // Ticket médio (dr/pg) similar ao Dashboard
  const ticketMedio = (() => {
    const dr = stats?.dailyRevenue != null ? Number(stats.dailyRevenue) : null;
    const pg = stats?.paymentsGenerated != null ? Number(stats.paymentsGenerated) : null;
    if (dr == null || pg == null || pg <= 0) return null;
    return utilsservice.formatarParaReal(dr / pg);
  })();

  const cards = [
    { key: 'available', title: 'Saldo disponível', value: balance != null ? utilsservice.formatarParaReal(balance) : '—', icon: <WalletIcon size={18} /> },
    { key: 'to_receive', title: 'A Receber', value: utilsservice.formatarParaReal(0), icon: <TrendingUp size={18} /> },
    { key: 'awaiting', title: 'Aguardando antecipação', value: utilsservice.formatarParaReal(0), icon: <Clock size={18} /> },
    { key: 'reserve', title: 'Reserva financeira', value: utilsservice.formatarParaReal(0), icon: <DollarSign size={18} /> },
    { key: 'ticket', title: 'Ticket Médio', value: ticketMedio ?? '—', icon: <Target size={18} /> },
  ];

  const TopTabs = () => (
    <div className="sticky top-0 z-20 bg-[var(--background-color)]/95 backdrop-blur border-b border-white/10 flex items-center gap-1.5 md:gap-3 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap snap-x snap-mandatory w-full overscroll-x-contain touch-pan-x px-4">
      {[
        { key: 'saldo', label: 'Saldo' },
        { key: 'depositar', label: 'Depositar' },
        { key: 'pix', label: 'Transferência PIX' },
        { key: 'cripto', label: 'Transferência via Crypto' },
        { key: 'interna', label: 'Transferência Interna' },
      ].map((t: any) => (
        <button
          key={t.key}
          onClick={() => setActiveTab(t.key)}
          className={`relative py-1.5 px-1.5 text-[10px] md:text-sm leading-tight transition snap-start min-w-[84px] sm:min-w-0 flex-none ${activeTab === t.key ? 'text-white' : 'text-white/70 hover:text-white'}`}
          aria-current={activeTab === t.key ? 'page' : undefined}
        >
          {t.label}
          <span className={`block h-[2px] mt-2 rounded ${activeTab === t.key ? 'bg-[var(--primary-color)]' : 'bg-transparent'}`} />
        </button>
      ))}
    </div>
  );

  const IconChip = ({ children }: { children: React.ReactNode }) => (
    <div className="relative flex items-center justify-center text-white">
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full grid place-items-center relative overflow-hidden">
        <span className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-light) 100%)', border: '1px solid rgba(255,255,255,0.08)' }} />
        <span className="absolute -inset-[1.5px] rounded-full opacity-60" style={{ border: '1px solid var(--shadow-color)' }} />
        <span className="relative z-10">{children}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background-color)] overflow-x-hidden w-full max-w-[100vw]">
      <div className="p-4 lg:p-6">
        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">Carteira</h1>
      </div>

      <div className="flex-1 px-4 lg:px-6 pb-[calc(env(safe-area-inset-bottom)+84px)] overflow-y-auto overflow-x-hidden no-scrollbar w-full max-w-[100vw]">
        <TopTabs />

        {activeTab === 'saldo' && (
        <div className="w-full max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full">
            {cards.map((c) => (
              <div key={c.key} className="w-full">
                <Card title={c.title}>
                  <div className="mt-1 flex items-start justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <IconChip>{c.icon}</IconChip>
                      <div className="mt-1 text-xl sm:text-2xl md:text-3xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{c.value}</div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Tabela de transações concluídas */}
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm md:text-lg font-semibold">Transações concluídas</h2>
            </div>

            <div className="bg-[var(--card-background)]/95 border border-white/10 rounded-2xl overflow-hidden">
              {/* Mobile list */}
              <div className="block lg:hidden overflow-x-hidden">
                {txLoading ? (
                  <div className="p-3 text-xs md:text-sm text-white/60">Carregando...</div>
                ) : transactions.length === 0 ? (
                  <div className="p-3 text-xs md:text-sm text-white/60">Nenhuma transação concluída.</div>
                ) : (
                  transactions.map((t) => (
                    <div key={t.id} className="px-3 py-3 border-b border-white/5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[10px] text-white/60">ID</div>
                          <div className="text-xs md:text-sm font-medium break-all">{t.transaction_id}</div>
                        </div>
                        <div className="text-xs md:text-sm font-semibold text-emerald-400 whitespace-nowrap">{utilsservice.formatarParaReal(Number(t.amount))}</div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] md:text-xs text-white/60">
                        <span className="break-all">{t.category} • {t.method}</span>
                        <span className="text-right break-all md:whitespace-nowrap">{t.date}</span>
                      </div>
                      <div className="mt-2">
                        {t.has_receipt ? (
                          <button onClick={() => fetchReceipt(t.transaction_id)} className="text-[11px] md:text-[12px] text-blue-400 hover:underline inline-flex items-center gap-1">
                            <Receipt size={12} /> Comprovante
                          </button>
                        ) : (
                          <span className="text-[11px] md:text-[12px] text-white/40">Sem comprovante</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-xs uppercase tracking-wide text-white/50">Id da Transação</th>
                      <th className="text-left p-4 text-xs uppercase tracking-wide text-white/50">Categoria</th>
                      <th className="text-left p-4 text-xs uppercase tracking-wide text-white/50">Método</th>
                      <th className="text-left p-4 text-xs uppercase tracking-wide text-white/50">Valor</th>
                      <th className="text-left p-4 text-xs uppercase tracking-wide text-white/50">Data</th>
                      <th className="text-left p-4 text-xs uppercase tracking-wide text-white/50">Comprovante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txLoading ? (
                      <tr><td colSpan={6} className="p-4 text-sm text-white/60">Carregando...</td></tr>
                    ) : transactions.length === 0 ? (
                      <tr><td colSpan={6} className="p-4 text-sm text-white/60">Nenhuma transação concluída.</td></tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 text-sm">{t.transaction_id}</td>
                          <td className="p-4 text-sm text-white/70">{t.category}</td>
                          <td className="p-4 text-sm text-white/70">{t.method}</td>
                          <td className="p-4 text-sm font-medium text-emerald-400">{utilsservice.formatarParaReal(Number(t.amount))}</td>
                          <td className="p-4 text-sm text-white/70">{t.date}</td>
                          <td className="p-4 text-sm">
                            {t.has_receipt ? (
                              <button onClick={() => fetchReceipt(t.transaction_id)} className="text-blue-400 hover:underline inline-flex items-center gap-1">
                                <Receipt size={16} /> Comprovante
                              </button>
                            ) : (
                              <span className="text-white/40">Sem comprovante</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="flex flex-wrap items-center justify-between p-2 md:p-3 gap-2 border-t border-white/5 text-[10px] md:text-xs">
                <button onClick={() => fetchCompleted(Math.max(page - 1, 1))} disabled={page === 1} className="px-2 py-1 md:px-3 rounded bg-white/5 disabled:opacity-40">
                  Anterior
                </button>
                <span className="text-white/60 min-w-0">Página {page} de {totalPages}</span>
                <button onClick={() => fetchCompleted(Math.min(page + 1, totalPages))} disabled={page === totalPages} className="px-2 py-1 md:px-3 rounded bg-white/5 disabled:opacity-40">
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'depositar' && (
        <div className="bg-transparent">
          <DepositMoney embedded />
        </div>
      )}
      {activeTab === 'pix' && (
        <div className="bg-transparent">
          <WithdrawMoney embedded />
        </div>
      )}
      {activeTab === 'cripto' && (
        <div className="bg-transparent">
          <CryptoWithdraw embedded />
        </div>
      )}
      {activeTab === 'interna' && (
        <div className="bg-transparent">
          <InternalTransfer embedded />
        </div>
      )}
      </div>

      {/* Modal Comprovante */}
      {receiptOpen && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[var(--card-background)]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-semibold">Comprovante</h3>
              <button onClick={() => { setReceiptOpen(false); setReceiptData(null); }} className="text-white/60 hover:text-white text-sm">Fechar</button>
            </div>
            <div className="p-5 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-white/60">ID</span><span className="font-mono">{receiptData.transaction_id}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/60">Recebedor</span><span>{receiptData.nome_recebedor}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/60">Documento</span><span className="font-mono">{receiptData.cpf_recebedor}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/60">Banco</span><span>{receiptData.banco}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/60">Valor</span><span className="font-semibold">{utilsservice.formatarParaReal(Number(receiptData.amount))}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/60">Data</span><span>{receiptData.created_at}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
