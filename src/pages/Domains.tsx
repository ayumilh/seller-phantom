import React, { useContext, useState } from 'react';
import { Globe, Plus, Search, Filter, ChevronRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';
import { PageHeader } from '../components/PageHeader';
import { generateDomains } from '../lib/mockData';

const domains = generateDomains(5);

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  pending: "bg-yellow-500/10 text-yellow-500",
  failed: "bg-red-500/10 text-red-500"
};

export default function Domains() {
  const { isDarkMode } = useContext(ThemeContext);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  return (
    <>
      <PageHeader
        title="Domínios"
        description="Gerencie seus domínios personalizados"
      >
        <button 
          onClick={() => setShowAddDomain(true)}
          className="bg-[var(--primary-color)] text-white px-4 py-1.5 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Adicionar domínio</span>
        </button>
      </PageHeader>

      <div className="p-4 lg:p-8">
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
          {/* Filters */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className={`flex-1 flex items-center gap-2 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-100'} px-3 py-2 rounded-lg`}>
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar domínio..."
                  className="bg-transparent border-none focus:outline-none text-sm flex-1 text-gray-400 placeholder-gray-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className={`flex items-center gap-2 ${isDarkMode ? 'bg-[var(--card-background)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-gray-400 transition-colors`}>
                  <Filter size={20} />
                  <span className="text-sm">Filtros</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Domínio</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">SSL</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Última verificação</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((domain) => (
                  <tr key={domain.id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[#1E1E2E]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Globe size={20} className="text-[var(--primary-color)]" />
                        <span className="text-sm font-medium">{domain.domain}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm px-2 py-1 rounded-full ${statusColors[domain.status as keyof typeof statusColors]}`}>
                        {domain.status === 'active' ? 'Ativo' : 'Pendente'}
                      </span>
                    </td>
                    <td className="p-4">
                      {domain.ssl ? (
                        <div className="flex items-center gap-1 text-green-500">
                          <CheckCircle2 size={16} />
                          <span className="text-sm">Ativo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-500">
                          <XCircle size={16} />
                          <span className="text-sm">Inativo</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400">{domain.lastVerified}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button className={`text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} p-2 rounded-lg transition-colors`}>
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Domain Modal */}
      {showAddDomain && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl w-full max-w-lg border`}>
            <div className={`p-6 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
              <h3 className="text-xl font-semibold">Adicionar domínio</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Domínio
                </label>
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className={`w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                  placeholder="Ex: checkout.seudominio.com"
                />
              </div>

              <div className={`p-4 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-50'} rounded-lg`}>
                <h4 className="font-medium mb-2">Configuração DNS</h4>
                <p className="text-sm text-gray-400">
                  Adicione os seguintes registros no seu provedor DNS:
                </p>
                <div className="mt-4 space-y-2">
                  <div className={`p-3 ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono">CNAME</span>
                      <span className="text-sm font-mono text-gray-400">checkout.gateway.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'} flex items-center justify-end gap-2`}>
              <button
                onClick={() => setShowAddDomain(false)}
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Adicionar domínio
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}