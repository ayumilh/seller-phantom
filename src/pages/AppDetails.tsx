import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import { ArrowLeft, Star } from 'lucide-react';

interface AppInfo {
  id: string;
  title: string;
  logoUrl: string;
  shortDescription: string;
  longDescription: string;
  howToUse: string[];
  galleryImages: string[];
  videoUrl?: string;
  rating?: number; // 0..5
  ratingCount?: number;
  status?: string;
  actionText?: string; // CTA label
  actionUrl?: string;  // CTA link
}

const appsCatalog: Record<string, AppInfo> = {
  utmify: {
    id: 'utmify',
    title: 'Utmify',
    logoUrl: 'https://app.utmify.com.br/logo/logo-white.png',
    shortDescription: 'É uma plataforma de trackeamento de vendas no TikTok, Facebook, Google e Kwai.',
    longDescription:
      'O Utmify permite integrar suas fontes de tráfego para acompanhar conversões com precisão. Acompanhe campanhas por canal e otimize seu ROI com métricas confiáveis.',
    howToUse: [
      'Crie uma conta no Utmify e gere sua chave de API.',
      'No painel, acesse Central de Apps > Utmify e clique em Conectar.',
      'Cole a chave de API e defina os eventos que deseja enviar.',
      'Finalize e valide os eventos no relatório de conversões.',
    ],
    galleryImages: [
      'https://dummyimage.com/800x450/141517/ffffff&text=Dashboard+Utmify',
      'https://dummyimage.com/800x450/141517/ffffff&text=Configura%C3%A7%C3%B5es+de+Eventos',
      'https://dummyimage.com/800x450/141517/ffffff&text=Relat%C3%B3rios+de+Convers%C3%B5es',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 4.6,
    ratingCount: 1833,
    status: 'Ativo',
  },
  vega: {
    id: 'vega',
    title: 'Vega Checkout',
    logoUrl: 'https://www.maximuspay.com.br/images/vega-logo.png',
    shortDescription: 'Checkout otimizado para conversão com múltiplos meios de pagamento.',
    longDescription: 'Aprimore a conversão do seu checkout com métodos variados e UX moderna.',
    howToUse: [],
    galleryImages: [],
    status: 'Ativo',
    actionText: 'Acessar',
    actionUrl: 'https://google.com',
  },
  luna: {
    id: 'luna',
    title: 'Luna Checkout',
    logoUrl: 'https://lunacheckout.com/_next/static/media/logo-light.83a313fc.png',
    shortDescription: 'Checkout moderno e leve para vendas digitais.',
    longDescription: 'Checkout fluido e com performance.',
    howToUse: [],
    galleryImages: [],
    status: 'Ativo',
  },
  shopify: {
    id: 'shopify',
    title: 'Shopify',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Shopify_logo.svg',
    shortDescription: 'Venda online com a plataforma de e-commerce mais popular.',
    longDescription: 'Conecte sua loja e sincronize produtos e pedidos.',
    howToUse: [],
    galleryImages: [],
    status: 'Ativo',
  },
  reportana: {
    id: 'reportana',
    title: 'Reportana',
    logoUrl: 'https://reportana.com/themes/reportana/assets/img/reportana-white-logo.svg',
    shortDescription: 'Dashboards e relatórios avançados para o seu negócio.',
    longDescription: 'Construa relatórios e acompanhe indicadores.',
    howToUse: [],
    galleryImages: [],
    status: 'Ativo',
  },
  xtracky: {
    id: 'xtracky',
    title: 'Xtracky',
    logoUrl: 'https://lp.xtracky.com/wp-content/uploads/2025/05/log-xtracky.webp',
    shortDescription: 'Rastreie métricas e campanhas com precisão.',
    longDescription: 'Integrador de tracking e relatórios.',
    howToUse: [],
    galleryImages: [],
    status: 'Ativo',
  },
  webhooks: {
    id: 'webhooks',
    title: 'Webhooks',
    logoUrl: 'https://cdn.freebiesupply.com/logos/large/2x/webhooks-logo-svg-vector.svg',
    shortDescription: 'Dispare eventos para suas URLs ao ocorrerem ações na plataforma.',
    longDescription: 'Cadastre endpoints para receber eventos como criação de pedido, pagamento aprovado e estornos.',
    howToUse: [],
    galleryImages: [],
    status: 'Em breve',
  },
};

export default function AppDetails() {
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const app = id ? appsCatalog[id] : undefined;

  if (!app) {
    return (
      <div className="p-4 lg:p-8">
        <header className="mb-6">
          <Link to="/apps" className="inline-flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft size={18} /> Voltar para Central de Apps
          </Link>
        </header>
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h2 className="text-lg font-semibold">App não encontrado</h2>
          <p className="text-sm text-gray-400 mt-1">Verifique a URL e tente novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <Link to="/apps" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <img src={app.logoUrl} alt={app.title} className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-2xl font-bold">{app.title}</h1>
              <p className="text-sm text-gray-400">{app.shortDescription}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda: infos rápidas */}
        <aside className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} border rounded-xl p-5 h-fit`}>
          <div className="space-y-3">
            {typeof app.rating === 'number' && (
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(app.rating || 0) ? 'text-yellow-400' : 'text-white/20'} />
                ))}
                <span className="text-sm text-white/80 font-medium">{app.rating?.toFixed(1)} ({app.ratingCount?.toLocaleString()})</span>
              </div>
            )}
            <div className="text-xs uppercase tracking-wide text-white/60">Status</div>
            <div className="text-sm font-medium">{app.status || '—'}</div>
            <a href="#como-usar" className="inline-block mt-2 text-[var(--primary-color)] text-sm">Como usar</a>

            {app.actionText && app.actionUrl && (
              <a
                href={app.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center w-full h-10 px-3 rounded-lg bg-[var(--primary-color)] text-white text-sm font-medium hover:opacity-90 transition"
              >
                {app.actionText}
              </a>
            )}
          </div>
        </aside>

        {/* Coluna principal */}
        <main className="lg:col-span-2 space-y-6">
          <section className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
            <h2 className="text-lg font-semibold">Sobre</h2>
            <p className="text-sm text-white/70 mt-2">{app.longDescription}</p>
            {app.videoUrl && (
              <div className="mt-4 aspect-video w-full rounded-lg overflow-hidden border border-white/10">
                <iframe
                  src={app.videoUrl}
                  title={`${app.title} video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </section>

          {app.galleryImages?.length > 0 && (
            <section className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
              <h2 className="text-lg font-semibold">Galeria</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {app.galleryImages.map((src, idx) => (
                  <img key={idx} src={src} alt={`img-${idx}`} className="w-full h-44 object-cover rounded-lg border border-white/10" />
                ))}
              </div>
            </section>
          )}

          <section id="como-usar" className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
            <h2 className="text-lg font-semibold">Como usar</h2>
            {app.howToUse?.length ? (
              <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-white/80">
                {app.howToUse.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-white/60 mt-2">Em breve adicionaremos um guia detalhado.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
