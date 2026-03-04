import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { 
  Book, 
  Terminal, 
  Webhook, 
  ShieldCheck, 
  Boxes,
  Menu,
  X,
  Github,
  Search,
  LogIn,
  Headphones
} from 'lucide-react';
import { LanguageSelector } from '../../components/LanguageSelector';

const getNavigation = (intl: ReturnType<typeof useIntl>) => [
  {
    title: intl.formatMessage({ id: 'docs.nav.docTitle' }),
    icon: Book,
    items: [
      { name: intl.formatMessage({ id: 'docs.nav.intro' }), href: "#top" },
      { name: intl.formatMessage({ id: 'docs.nav.urlBase' }), href: "#url-base" }
    ]
  },
  {
    title: intl.formatMessage({ id: 'docs.nav.resourcesTitle' }),
    icon: Boxes,
    items: [
      { name: intl.formatMessage({ id: 'docs.nav.auth' }), href: "#autenticacao" },
      { name: intl.formatMessage({ id: 'docs.nav.deposit' }), href: "#deposito" },
      { name: intl.formatMessage({ id: 'docs.nav.withdraw' }), href: "#saque" },
      { name: intl.formatMessage({ id: 'docs.nav.statusTrans' }), href: "#status-transacao" },
      { name: intl.formatMessage({ id: 'docs.nav.balance' }), href: "#saldo-conta" }
    ]
  },
  {
    title: intl.formatMessage({ id: 'docs.nav.webhooksTitle' }),
    icon: Webhook,
    items: [
      { name: intl.formatMessage({ id: 'docs.nav.webhooksOverview' }), href: "#webhooks" }
    ]
  },
  {
    title: intl.formatMessage({ id: 'docs.nav.errorsTitle' }),
    icon: ShieldCheck,
    items: [
      { name: intl.formatMessage({ id: 'docs.nav.errorHandling' }), href: "#erros" }
    ]
  },
  {
    title: intl.formatMessage({ id: 'docs.nav.toolsTitle' }),
    icon: Terminal,
    items: [
      { name: intl.formatMessage({ id: 'docs.nav.apiPlayground' }), href: "#playground" }
    ]
  }
];

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const intl = useIntl();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useLocation();
  const navigation = getNavigation(intl);

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--card-background)]/80 backdrop-blur-xl border-b border-white/5 w-full">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-4 sm:gap-8">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.jpeg" alt="PhantomPay" className="h-6 w-auto object-contain" />
              </Link>
              <div className="hidden lg:flex items-center gap-6">
                <Link to="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">{intl.formatMessage({ id: 'docs.header.documentation' })}</Link>
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">
                  <LogIn size={16} /> {intl.formatMessage({ id: 'docs.header.login' })}
                </Link>
                <Link to="/docs#suporte" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">
                  <Headphones size={16} /> {intl.formatMessage({ id: 'docs.header.support' })}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageSelector />
              <div className="hidden lg:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder={intl.formatMessage({ id: 'docs.header.searchPlaceholder' })}
                  className="bg-transparent border-none text-sm focus:outline-none text-gray-400 placeholder-gray-500 w-32 sm:w-64"
                />
                <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-[var(--card-background)] px-1.5 font-mono text-[10px] font-medium text-gray-400 border-white/5">
                  ⌘K
                </kbd>
              </div>

              <a
                href="https://github.com/your-org/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                aria-label={intl.formatMessage({ id: 'docs.header.openMenu' })}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full">
        <div className="flex flex-col lg:flex-row relative">
          {/* Sidebar */}
          <aside
            className={`
              fixed top-16 bottom-0 left-0 z-40 w-64 max-w-full bg-[var(--card-background)] border-r border-white/5 transform transition-transform duration-200 ease-in-out
              lg:static lg:translate-x-0 lg:block
              ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            style={{ left: 'max(env(safe-area-inset-left), 0px)' }}
          >
            <nav className="p-4 h-full overflow-y-auto">
              {navigation.map((section, index) => (
                <div key={index} className="mb-8">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-400">
                    <section.icon size={16} />
                    <span>{section.title}</span>
                  </div>
                  <ul className="space-y-1">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <a
                          href={item.href}
                          className="block px-3 py-2 rounded-lg text-sm transition-colors text-gray-400 hover:bg-white/5"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Overlay mobile para menu aberto */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 top-16 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 p-4 pt-6 sm:p-8 lg:pl-72 h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Aplica responsividade para blocos de código */}
            <div className="docs-content [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/80 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:mb-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}