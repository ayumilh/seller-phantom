import React, { useContext } from 'react';
import { 
  Globe,
  ShoppingCart,
  Share2,
  ChevronRight,
  Check,
  BarChart3,
  MessageSquare,
  Facebook,
  Search,
  Filter
} from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';

const integrations = [
  {
    category: "E-commerce",
    icon: ShoppingCart,
    items: [
      {
        name: "Shopify",
        description: "Integre sua loja Shopify",
        status: "connected",
        logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=48&h=48&fit=crop"
      },
      {
        name: "WooCommerce",
        description: "Integre sua loja WooCommerce",
        status: "available",
        logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=48&h=48&fit=crop"
      }
    ]
  },
  {
    category: "Marketing",
    icon: BarChart3,
    items: [
      {
        name: "UTMIFY",
        description: "Rastreamento avançado de UTMs",
        status: "available",
        logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=48&h=48&fit=crop"
      },
      {
        name: "ADOREI",
        description: "Plataforma de recompensas",
        status: "available",
        logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=48&h=48&fit=crop"
      }
    ]
  },
  {
    category: "Redes Sociais",
    icon: Share2,
    items: [
      {
        name: "Facebook",
        description: "Integração com Facebook Ads",
        status: "connected",
        logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=48&h=48&fit=crop"
      },
      {
        name: "TikTok",
        description: "Integração com TikTok Ads",
        status: "available",
        logo: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=48&h=48&fit=crop"
      }
    ]
  },
  {
    category: "Anúncios",
    icon: MessageSquare,
    items: [
      {
        name: "Google Ads",
        description: "Integração com Google Ads",
        status: "connected",
        logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=48&h=48&fit=crop"
      }
    ]
  }
];

export default function Integrations() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <>
      <header className={`sticky top-0 z-20 bg-[var(--background-color)] px-4 lg:px-8 py-4`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Integrações</h1>
            <p className="text-sm text-gray-400">Gerencie suas integrações</p>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        {/* Search */}
        <div className="mb-8">
          <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} px-4 py-3 rounded-lg border`}>
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar integração..."
              className="bg-transparent border-none focus:outline-none text-sm flex-1 text-gray-400 placeholder-gray-500"
            />
            <button className={`flex items-center gap-2 ${isDarkMode ? 'bg-[var(--card-background)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-gray-400 transition-colors`}>
              <Filter size={20} />
              <span className="text-sm">Filtros</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {integrations.map((category, index) => (
            <div key={index} className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
              <div className={`p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <category.icon size={20} className="text-[var(--primary-color)]" />
                  <h2 className="text-lg font-semibold">{category.category}</h2>
                </div>
              </div>
              <div className={`divide-y ${isDarkMode ? 'divide-[#1E1E2E]' : 'divide-gray-200'}`}>
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`p-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-[#1E1E2E]/50' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.logo} alt={item.name} className="w-12 h-12 rounded-lg" />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === 'connected' ? (
                        <span className="flex items-center gap-1 text-sm text-green-500">
                          <Check size={16} />
                          Conectado
                        </span>
                      ) : (
                        <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg text-sm hover:bg-[var(--primary-color)]/90 transition-colors">
                          Conectar
                        </button>
                      )}
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}