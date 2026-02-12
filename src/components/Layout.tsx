import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../dist/assets/logo.png';
import { BadgeDollarSign, Settings, Menu, X, Home, LogOut, FileText, ChevronDown, PieChart, Send, ArrowDownLeft, ArrowUpRight, User, Wallet, Award } from 'lucide-react';
import { updateThemeVariables } from '../lib/theme';
import { utilsservice } from '../services/utilsService';
import { withdrawService } from '../services/withdrawService';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  hasChevron?: boolean;
  isExternal?: boolean;
  subItems?: {
    label: string;  
    path: string;
  }[];
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: BadgeDollarSign, label: 'Carteira', path: '/carteira' },
  { icon: PieChart, label: 'Relatórios', path: '/relatorios-dashboard' },
  {
    icon: FileText,
    label: 'Relatórios Detalhados',
    path: '/relatorios',
    hasChevron: true,
    subItems: [
      { label: 'Entradas', path: '/relatorios/entradas' },
      { label: 'Bloqueios Cautelares', path: '/relatorios/bloqueios-cautelares' },
      { label: 'Saídas', path: '/relatorios/saidas' },
      { label: 'Splits', path: '/relatorios/splits' }
    ]
  },
  { icon: User, label: 'Perfil', path: '/configuracoes/perfil' },
  { icon: Award, label: 'Premiações', path: '/premiacoes' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' }
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Tema fixo escuro
  // Submenus foram achatados em seções com itens diretos
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hideLayout, setHideLayout] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [sidebarBalance, setSidebarBalance] = useState<string | null>(null);
  useEffect(() => {
    const token = utilsservice.getTokenValido();
    setHideLayout(location.pathname.startsWith('/checkout/'));

    if (!token) {
      setToken(null);
    } else {
      setToken(token);
    }

    document.documentElement.classList.add('dark');
    updateThemeVariables();

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    return () => {};
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const data = await withdrawService.getBalanceUser();
        setSidebarBalance(String(data.balance ?? '0'));
      } catch (e) {
        // silently fail
      }
    };
    if (token) loadBalance();
  }, [token]);

  useEffect(() => {
    const widgetId = import.meta.env.VITE_JIVO_WIDGET_ID as string | undefined;
    const canShow = token && !hideLayout;
    if (!canShow || !widgetId) return;
    if ((window as any).__jivo_loaded__) return;
    const s = document.createElement('script');
    s.src = `https://code.jivosite.com/widget/${widgetId}`;
    s.async = true;
    s.defer = true;
    document.body.appendChild(s);
    (window as any).__jivo_loaded__ = true;

    // Ensure the widget is above the mobile footer by adding a CSS offset
    const STYLE_ID = 'jivo-widget-mobile-offset';
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.innerHTML = `
        @media (max-width: 1024px) {
          /* Common Jivo containers */
          #jivo-iframe-container,
          #jivo_container,
          #jivo_minimized_container,
          /* Jivo uses custom <jdiv> elements; target common button/bubble classes */
          jdiv[class*="logoIcon"],
          jdiv[class*="Widget"],
          jdiv[class*="Button"],
          jdiv[id^="jivo-"] {
            bottom: calc(136px + env(safe-area-inset-bottom)) !important;
            right: 16px !important;
            z-index: 60 !important;
          }

          /* Explicitly target wrappers seen in DOM to keep them aligned */
          jdiv.iconWrap__ff_qq,
          jdiv.jivoIcon__MYIFI,
          jdiv.logoIconCloud__Z4LwY {
            position: fixed !important;
            bottom: calc(136px + env(safe-area-inset-bottom)) !important;
            right: 16px !important;
            margin: 0 !important;
            transform: none !important;
            z-index: 61 !important;
          }

          /* Try to tint white SVG backgrounds to primary using drop-shadow trick */
          jdiv.jivoIcon__MYIFI,
          jdiv.logoIconCloud__Z4LwY {
            filter: drop-shadow(0 0 0 var(--primary-color)) drop-shadow(0 0 0 var(--primary-color));
          }

          /* Keep only the main minimized bubble visible */
          /* Hide cloud/logo and vertical mark icons that Jivo sometimes renders */
          jdiv.logoIconCloud__Z4LwY,
          jdiv.jivoIcon__MYIFI,
          jdiv[class*="logoIconCloud"],
          jdiv[class*="IconCloud"],
          jdiv[class*="ShowLogo"],
          jdiv[class*="showLogo"],
          jdiv[class*="Brand"],
          jdiv[class*="Logo"],
          jdiv[class*="logo"] {
            display: none !important;
          }

          /* Center the chat icon inside the bubble */
          jdiv.button__sRuwS {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          jdiv.iconWrap__ff_qq {
            position: static !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
          }
          /* Show only the envelope icon as the bubble icon */
          jdiv.envelopeIcon__a4mM_ {
            display: block !important;
            width: 22px !important;
            height: 22px !important;
            background-size: contain !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            filter: drop-shadow(0 0 0 var(--primary-color));
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, [token, hideLayout]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expira_em');
    navigate('/login');
  }

  // Remove alternância de tema (escuro fixo)

  const handleMenuItemClick = (_item: MenuItem) => {};

  const isSubItemActive = (_item: MenuItem) => false;

   const getFirstName = (name: string) => {
    if (!name) return '';
    return name.trim().split(' ')[0];
  };


  const getSubIcon = (label: string): React.ElementType => {
    switch (label.toLowerCase()) {
      case 'depositar':
        return ArrowUpRight;
      case 'transferência pix':
        return Send;
      case 'transferência via crypto':
        return Send;
      case 'transferência interna':
        return ArrowDownLeft;
      case 'entradas':
        return ArrowUpRight;
      case 'bloqueios cautelares':
        return FileText;
      case 'saídas':
        return ArrowDownLeft;
      case 'splits':
        return PieChart;
      default:
        return FileText;
    }
  };
  return (
    <>
      {token && !hideLayout ? (
        <div className={`min-h-screen bg-[var(--background-color)] text-white`}>
          {/* Top Bar (desktop somente) */}
          <div className={`hidden lg:block fixed top-0 left-0 right-0 z-50 bg-[var(--card-background)]/90 backdrop-blur-xl border-b border-white/5 py-2 px-4 lg:px-8`}>
            <div className="grid grid-cols-3 items-center">
              {/* Esquerda: menu mobile */}
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Abrir menu"
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

          {/* Modal Gerente de Relacionamento (centralizado sobre a página) */}
          {showManagerModal && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowManagerModal(false)} />
              <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[var(--card-background)]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
                <span className="pointer-events-none absolute left-0 right-0 top-0 h-16 rounded-t-2xl" style={{ background: 'linear-gradient(180deg, var(--primary-color)10 0%, transparent 100%)' }} />
                <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
                <div className="pointer-events-none absolute bottom-[-25%] left-[-20%] w-56 h-56 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
                <button onClick={() => setShowManagerModal(false)} className="absolute top-3 right-3 p-2 rounded-lg hover:bg-white/5" aria-label="Fechar">
                  <X size={18} />
                </button>
                <div className="px-5 pt-5">
                  <h3 className="font-semibold text-white text-lg">Gerente de Relacionamento</h3>
                </div>
                <div className="px-5 pb-1 pt-3">
                  <div className="flex flex-row items-center justify-start bg-white/5 rounded-lg gap-4 px-4 py-4 border border-white/10">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor" className="text-[var(--primary-color)]"><path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.07 22 2 13.93 2 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z"/></svg>
                    <div className="flex-col">
                      <div className="text-2xl font-medium">Gerente Jhon</div>
                      <div className="text-lg font-semibold">(11) 96067-9774</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <a href="https://wa.me/5511960679774" target="_blank" rel="noopener noreferrer" className="rounded-lg py-2 px-6 flex items-center justify-center gap-2 text-sm font-medium bg-[var(--primary-color)] text-white hover:opacity-90 active:scale-95 transition">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967s-.47-.148-.669.15c-.198.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.52s.198-.298.297-.497c.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.174-.008-.372-.01-.57-.01s-.52.074-.792.372c-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074s2.095 3.2 5.076 4.487c.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.57-.085 1.758-.719 2.006-1.413s.247-1.289.173-1.413-.272-.198-.57-.347Zm-5.422 7.403h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214-3.742.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.899a9.82 9.82 0 0 1 2.892 6.992c-.002 5.45-4.436 9.885-9.884 9.885Zm8.412-18.297A11.82 11.82 0 0 0 11.992 0C5.438 0 .102 5.335.1 11.892c-.001 2.096.546 4.142 1.587 5.945L0 24l6.304-1.654a11.9 11.9 0 0 0 5.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.82 11.82 0 0 0-3.48-8.413" clipRule="evenodd"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>
                      Whatsapp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Gerente de Relacionamento (centralizado sobre a página) */}
          {showManagerModal && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowManagerModal(false)} />
              <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[var(--card-background)]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
                <span className="pointer-events-none absolute left-0 right-0 top-0 h-16 rounded-t-2xl" style={{ background: 'linear-gradient(180deg, var(--primary-color)10 0%, transparent 100%)' }} />
                <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
                <div className="pointer-events-none absolute bottom-[-25%] left-[-20%] w-56 h-56 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
                <button onClick={() => setShowManagerModal(false)} className="absolute top-3 right-3 p-2 rounded-lg hover:bg-white/5" aria-label="Fechar">
                  <X size={18} />
                </button>
                <div className="px-5 pt-5">
                  <h3 className="font-semibold text-white text-lg">Gerente de Relacionamento</h3>
                </div>
                <div className="px-5 pb-1 pt-3">
                  <div className="flex flex-row items-center justify-start bg-white/5 rounded-lg gap-4 px-4 py-4 border border-white/10">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor" className="text-[var(--primary-color)]"><path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.07 22 2 13.93 2 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z"/></svg>
                    <div className="flex-col">
                      <div className="text-2xl font-medium">Gerente Jhon</div>
                      <div className="text-lg font-semibold">(11) 96067-9774</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <a href="https://wa.me/5511960679774" target="_blank" rel="noopener noreferrer" className="rounded-lg py-2 px-6 flex items-center justify-center gap-2 text-sm font-medium bg-[var(--primary-color)] text-white hover:opacity-90 active:scale-95 transition">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967s-.47-.148-.669.15c-.198.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.52s.198-.298.297-.497c.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.174-.008-.372-.01-.57-.01s-.52.074-.792.372c-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074s2.095 3.2 5.076 4.487c.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.57-.085 1.758-.719 2.006-1.413s.247-1.289.173-1.413-.272-.198-.57-.347Zm-5.422 7.403h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214-3.742.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.899a9.82 9.82 0 0 1 2.892 6.992c-.002 5.45-4.436 9.885-9.884 9.885Zm8.412-18.297A11.82 11.82 0 0 0 11.992 0C5.438 0 .102 5.335.1 11.892c-.001 2.096.546 4.142 1.587 5.945L0 24l6.304-1.654a11.9 11.9 0 0 0 5.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.82 11.82 0 0 0-3.48-8.413" clipRule="evenodd"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>
                      Whatsapp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Gerente de Relacionamento (centralizado, fora de Top Bar/Sidebar) */}
          {showManagerModal && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowManagerModal(false)} />
              {/* Conteúdo */}
              <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[var(--card-background)]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
                {/* Glow/gradiente top */}
                <span className="pointer-events-none absolute left-0 right-0 top-0 h-16 rounded-t-2xl" style={{ background: 'linear-gradient(180deg, var(--primary-color)10 0%, transparent 100%)' }} />
                {/* Gradientes internos */}
                <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
                <div className="pointer-events-none absolute bottom-[-25%] left-[-20%] w-56 h-56 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />

                {/* Fechar */}
                <button onClick={() => setShowManagerModal(false)} className="absolute top-3 right-3 p-2 rounded-lg hover:bg-white/5" aria-label="Fechar">
                  <X size={18} />
                </button>

                {/* Título */}
                <div className="px-5 pt-5">
                  <h3 className="font-semibold text-white text-lg">Gerente de Relacionamento</h3>
                </div>

                {/* Corpo */}
                <div className="px-5 pb-1 pt-3">
                  <div className="flex flex-row items-center justify-start bg-white/5 rounded-lg gap-4 px-4 py-4 border border-white/10">
                    {/* Ícone telefone */}
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor" className="text-[var(--primary-color)]"><path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.07 22 2 13.93 2 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z"/></svg>
                    <div className="flex-col">
                      <div className="text-2xl font-medium">Gerente Jhon</div>
                      <div className="text-lg font-semibold">(11) 96067-9774</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <a
                      href="https://wa.me/5511960679774"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg py-2 px-6 flex items-center justify-center gap-2 text-sm font-medium bg-[var(--primary-color)] text-white hover:opacity-90 active:scale-95 transition"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)"><path fill="currentColor" fillRule="evenodd" d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967s-.47-.148-.669.15c-.198.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.52s.198-.298.297-.497c.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.174-.008-.372-.01-.57-.01s-.52.074-.792.372c-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074s2.095 3.2 5.076 4.487c.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.57-.085 1.758-.719 2.006-1.413s.247-1.289.173-1.413-.272-.198-.57-.347Zm-5.422 7.403h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214-3.742.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.899a9.82 9.82 0 0 1 2.892 6.992c-.002 5.45-4.436 9.885-9.884 9.885Zm8.412-18.297A11.82 11.82 0 0 0 11.992 0C5.438 0 .102 5.335.1 11.892c-.001 2.096.546 4.142 1.587 5.945L0 24l6.304-1.654a11.9 11.9 0 0 0 5.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.82 11.82 0 0 0-3.48-8.413" clipRule="evenodd"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>
                      Whatsapp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

              {/* Centro: busca centralizada */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md relative hidden md:block">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 placeholder:text-white/40 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                </div>
              </div>

              {/* Direita vazia para manter centralização */}
              <div />
            </div>
          </div>

          {/* Sidebar + Main */}
          <div className="flex pt-0">
            <aside
              className={`
                fixed inset-y-0 left-0 z-[70] w-56 group
                bg-[var(--card-background)]/95 backdrop-blur-xl border-white/5
                transform transition-all duration-300 ease-in-out
                border-r
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                top-0 lg:top-0
              `}
            >
              <div className="p-3 h-full mt-2 flex flex-col">
                {/* Botão fechar (mobile) */}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute right-2 top-2 p-2 rounded-lg hover:bg-white/5 lg:hidden"
                  aria-label="Fechar menu"
                >
                  <X size={18} />
                </button>

                {/* Cabeçalho (logo) */}
                <div className="mb-3 flex items-center justify-center">
                  <img src={logo} alt="Logo" className="w-32 h-10 object-contain" />
                </div>

                {/* Saldo Total (fora do Dashboard) */}
                {location.pathname !== '/' && (
                  <div className="mb-3 mx-1 rounded-xl border border-white/10 p-3"
                       style={{ background: 'linear-gradient(145deg, rgba(20,21,23,0.95) 0%, rgba(20,21,23,0.8) 100%)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[var(--primary-color)]/15 flex items-center justify-center">
                        <Wallet size={18} className="text-[var(--primary-color)]" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-white/60">Saldo Total</div>
                        <div className="text-sm font-semibold">{sidebarBalance != null ? utilsservice.formatarParaReal(Number(sidebarBalance)) : '—'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Área rolável */}
                <div className="flex-1 overflow-y-auto overscroll-contain pr-1 flex flex-col">
                  <nav className="space-y-1">
                    {menuItems.map((item, index) => (
                      <div key={index} className="mb-1">
                        {!item.subItems ? (
                          <Link
                            to={item.path}
                            className={`group flex items-center justify-between px-3 py-2 rounded-lg overflow-hidden whitespace-nowrap ${
                              location.pathname === item.path ? 'bg-white/5 text-white border border-white/10' : 'text-gray-300 hover:bg-white/5'
                            } transition-colors`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon size={16} className={`${location.pathname === item.path ? 'text-[var(--primary-color)]' : 'text-white/80'}`} />
                              <span className="text-[11px]">{item.label}</span>
                            </div>
                          </Link>
                        ) : (
                          <>
                            <div className="px-3 py-1 text-[10px] uppercase tracking-wide text-white/50">{item.label}</div>
                            {item.subItems.map((subItem, subIndex) => {
                              const SubIcon = getSubIcon(subItem.label);
                              return (
                                <Link
                                  key={`${index}-${subIndex}`}
                                  to={subItem.path}
                                  className={`group flex items-center justify-between px-3 py-2 rounded-lg overflow-hidden whitespace-nowrap ${
                                    location.pathname === subItem.path ? 'bg-white/5 text-white border border-white/10' : 'text-gray-300 hover:bg-white/5'
                                  } transition-colors`}
                                >
                                  <div className="flex items-center gap-3">
                                    <SubIcon size={14} className={`${location.pathname === subItem.path ? 'text-[var(--primary-color)]' : 'text-white/80'}`} />
                                    <span className="text-[11px]">{subItem.label}</span>
                                  </div>
                                </Link>
                              );
                            })}
                          </>
                        )}
                      </div>
                    ))}

                    {/* Separador e link final para Central de Apps */}
                    <div className="my-2 border-t border-white/5" />
                    <Link
                      to="/apps"
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg overflow-hidden whitespace-nowrap ${
                        location.pathname === '/apps' ? 'bg-white/5 text-white border border-white/10' : 'text-gray-300 hover:bg-white/5'
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <PieChart size={16} className={`${location.pathname === '/apps' ? 'text-[var(--primary-color)]' : 'text-white/80'}`} />
                        <span className="text-[11px]">Central de Apps</span>
                      </div>
                    </Link>
                  </nav>

                  {/* Cards no final da área rolável */}
                  <div className="mt-auto space-y-4">
                    {/* Card de Documentação */}
                    <div
                      className="relative rounded-2xl overflow-hidden border border-white/10 p-4 text-white"
                      style={{
                        background:
                          'radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.00) 60%), linear-gradient(145deg, rgba(20,21,23,0.9) 0%, rgba(20,21,23,0.85) 100%)',
                      }}
                    >
                      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
                      <div className="relative z-10 space-y-2">
                        <div className="text-xs uppercase tracking-wide text-white/70">API PIX?</div>
                        <div className="text-sm font-semibold leading-tight">Faça integração</div>
                        <a href="/docs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-9 px-3 rounded-lg bg-[var(--primary-color)] text-white text-sm hover:opacity-90 transition">Documentação</a>
                      </div>
                      <div className="absolute inset-0 opacity-20" aria-hidden>
                        <div className="absolute bottom-[-30%] left-[-20%] w-56 h-56 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle at center, var(--primary-color), transparent 60%)' }} />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Rodapé fixo da sidebar (fora da área rolável) */}
                <div className="mt-2 p-4 border-t border-white/5 bg-[var(--card-background)]/95">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full ring-2 ring-[var(--primary-color)]/30 flex items-center justify-center bg-[var(--primary-color)] text-white font-bold">
                        {username ? username.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="text-sm">
                        <div className="text-white/90">{getFirstName(username ?? 'Usuário')}</div>
                        <div className="text-white/50 text-xs">Conectado</div>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg flex items-center gap-2 text-sm">
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <main className="flex-1 min-h-screen md:pl-56 pb-28 lg:pb-0 lg:pt-[52px]">{children}</main>
          </div>

          {/* Footer Bar (mobile) - flutuante */}
          <div className="lg:hidden fixed left-0 right-0 bottom-4 z-50 flex justify-center" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}>
            <div className="relative px-5 h-16 rounded-full bg-[var(--card-background)]/95 border border-white/10 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] w-[92%] max-w-md flex items-center">
              {/* Botão central elevado */}
              <button onClick={() => navigate('/sacar')} className="absolute left-1/2 -translate-x-1/2 -top-7">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%)', boxShadow: '0 12px 28px var(--shadow-color)' }}>
                  <Send size={22} />
                </div>
                <div className="mt-1 text-center text-[0.6rem] text-white/90">Transferir</div>
              </button>

              {/* Itens da barra (5 itens, com o central reservado ao elevado) */}
              <div className="grid grid-cols-5 gap-2 items-center text-[0.6rem] text-white/80 w-full">
                {/* Menu */}
                <button onClick={() => setIsSidebarOpen(true)} className="flex flex-col items-center gap-1 py-1">
                  <Menu size={22} />
                </button>
                {/* Saídas */}
                <button onClick={() => navigate('/relatorios/saidas')} className="flex flex-col items-center gap-1 py-1">
                  <ArrowDownLeft size={22} />
                </button>
                {/* Espaço reservado ao botão central */}
                <div />
                {/* Entradas */}
                <button onClick={() => navigate('/relatorios/entradas')} className="flex flex-col items-center gap-1 py-1">
                  <ArrowUpRight size={22} />
                </button>
                {/* Configurações */}
                <button onClick={() => navigate('/configuracoes')} className="flex flex-col items-center gap-1 py-1">
                  <Settings size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
}