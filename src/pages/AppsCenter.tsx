import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { ThemeContext } from '../lib/theme.ts';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Badge } from 'lucide-react';

export default function AppsCenter() {
  const intl = useIntl();
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const apps = [
    {
      id: 'utmify',
      name: 'Utmify',
      description: intl.formatMessage({ id: 'apps.utmify.description' }),
      status: intl.formatMessage({ id: 'apps.status.comingSoon' }),
      statusKey: 'comingSoon',
      logoUrl: 'https://app.utmify.com.br/logo/logo-white.png',
    },
    {
      id: 'vega',
      name: 'Vega Checkout',
      description: intl.formatMessage({ id: 'apps.vega.description' }),
      status: intl.formatMessage({ id: 'apps.status.comingSoon' }),
      statusKey: 'comingSoon',
      logoUrl: 'https://www.maximuspay.com.br/images/vega-logo.png',
    },
    {
      id: 'luna',
      name: 'Luna Checkout',
      description: intl.formatMessage({ id: 'apps.luna.description' }),
      status: intl.formatMessage({ id: 'apps.status.comingSoon' }),
      statusKey: 'comingSoon',
      logoUrl: 'https://framerusercontent.com/images/iAj4L0XKRAsAWOkBvZUl7Xtm6DA.svg?width=251&height=88',
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: intl.formatMessage({ id: 'apps.shopify.description' }),
      status: intl.formatMessage({ id: 'apps.status.comingSoon' }),
      statusKey: 'comingSoon',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Shopify_logo.svg',
    },
    {
      id: 'reportana',
      name: 'Reportana',
      description: intl.formatMessage({ id: 'apps.reportana.description' }),
      status: intl.formatMessage({ id: 'apps.status.comingSoon' }),
      statusKey: 'comingSoon',
      logoUrl: 'https://reportana.com/themes/reportana/assets/img/reportana-white-logo.svg',
    },
    {
      id: 'xtracky',
      name: 'Xtracky',
      description: intl.formatMessage({ id: 'apps.xtracky.description' }),
      status: intl.formatMessage({ id: 'apps.status.comingSoon' }),
      statusKey: 'comingSoon',
      logoUrl: 'https://lp.xtracky.com/wp-content/uploads/2025/05/log-xtracky.webp',
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      description: intl.formatMessage({ id: 'apps.webhooks.description' }),
      status: intl.formatMessage({ id: 'apps.status.comingSoon' }),
      statusKey: 'comingSoon',
      logoUrl: 'https://cdn.freebiesupply.com/logos/large/2x/webhooks-logo-svg-vector.svg',
    },
  ];

  const StatusBadge = ({ label, active }: { label: string; active: boolean }) => {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/60'}`}>
        <Badge size={12} /> {label}
      </span>
    );
  };

  return (
    <div className="p-4 lg:p-8">
      <header className={`mb-4 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{intl.formatMessage({ id: 'apps.centerTitle' })}</h1>
            <p className="text-sm text-gray-400">{intl.formatMessage({ id: 'apps.centerDescription' })}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => {
          const isSoon = app.statusKey === 'comingSoon';
          return (
            <div key={app.id} className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} border rounded-xl p-5 flex flex-col items-start h-full min-h-[220px]`}>
              <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                <img src={app.logoUrl} alt={app.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="mt-3 w-full flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">{app.name}</h3>
                  <StatusBadge label={app.status} active={app.statusKey === 'active'} />
                </div>
                <p className="mt-1 text-sm text-white/70">{app.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 w-full">
                <button
                  onClick={() => { if (!isSoon) navigate(`/apps/${app.id}`); }}
                  disabled={isSoon}
                  className={`w-full h-9 rounded-lg text-sm bg-[var(--primary-color)] text-white transition ${isSoon ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                >
                  {intl.formatMessage({ id: 'apps.viewDetails' })}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
