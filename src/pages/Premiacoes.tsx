import React, { useEffect, useMemo, useState } from 'react';
import { Award } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { dashboardService } from '../services/dashboardService';
import { utilsservice } from '../services/utilsService';
import { AWARDS_MILESTONES, computeAwards } from '../lib/awards';

export default function Premiacoes() {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res: any = await dashboardService.getFinancialStats();
        const value = Number(res?.data?.totalRevenue ?? res?.totalRevenue ?? 0);
        if (!isNaN(value)) setTotalRevenue(value);
      } catch {
        setTotalRevenue(0);
      }
    };
    load();
  }, []);

  const { milestones, next, percent } = useMemo(() => computeAwards(totalRevenue), [totalRevenue]);

  return (
    <div className="p-4 lg:p-8 relative overflow-hidden">
      {/* Glow de fundo com cor primária */}
      <span className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
      <span className="pointer-events-none absolute -bottom-32 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />

      <PageHeader
        title="Premiações"
        description="Veja sua linha do tempo de premiações e seu progresso rumo ao próximo marco"
      >
        <div className="flex items-center gap-2 text-[var(--primary-color)]">
          <Award size={18} />
          <span className="text-sm">Programa de Recompensas</span>
        </div>
      </PageHeader>

      {/* Barra de progresso geral (igual ao conceito do Dashboard) */}
      <div className="bg-[var(--card-background)] border border-white/5 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/80">Faturamento total</span>
          <span className="text-sm font-semibold">{utilsservice.formatarParaReal(totalRevenue)}</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            title={utilsservice.formatarParaReal(totalRevenue)}
            style={{ width: `${percent}%`, background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--primary-color) 100%)' }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-white/60 mt-2">
          <span>0</span>
          <span>{utilsservice.formatarParaReal(next.amount)}</span>
        </div>
      </div>

      {/* Timeline de premiações */}
      <div className="bg-[var(--card-background)] border border-white/5 rounded-xl p-6">
        <div className="space-y-6">
          {milestones.map((m, idx) => {
            const completed = totalRevenue >= m.amount;
            const isLast = idx === milestones.length - 1;
            return (
              <div key={`${m.amount}-${idx}`} className="relative">
                {/* Linha conectora */}
                {!isLast && (
                  <div className={`absolute left-10 top-14 bottom-0 w-0.5 ${completed ? 'bg-[var(--primary-color)]' : 'bg-white/10'}`} />
                )}

                <div className="flex items-start gap-4">
                  {/* Ícone/Imagem da premiação */}
                  <div className={`relative z-10 w-20 h-20 rounded-xl overflow-hidden grid place-items-center border ${completed ? 'border-[var(--primary-color)]' : 'border-white/10'}`}>
                    <img src={m.img} alt={m.label} className="max-w-full max-h-full object-contain" />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{m.label}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${completed ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/10 text-white/60'}`}>
                        {completed ? 'Conquistado' : 'Em progresso'}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mb-3">Meta: {utilsservice.formatarParaReal(m.amount)}</p>

                    {/* Barra local (se for o next, mostra o progresso relativo) */}
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        title={completed ? utilsservice.formatarParaReal(m.amount) : utilsservice.formatarParaReal(totalRevenue)}
                        style={{
                          width: `${completed ? 100 : (m.amount === next.amount ? percent : 0)}%`,
                          background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--primary-color) 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
