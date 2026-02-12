import React, { useState, useContext } from 'react';
import { 
  Plus,
  Search,
  Filter,
  ChevronRight,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Play,
  History,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';
import { PageHeader } from '../components/PageHeader';
import { WebhookModal } from '../components/WebhookModal';
import { WebhookLogsModal } from '../components/WebhookLogsModal';
import { generateWebhooks } from '../lib/mockData';

const webhooks = generateWebhooks(5);

const logs = [
  {
    id: 1,
    webhookId: 1,
    event: "sale.created",
    status: "success",
    timestamp: "2024-02-20 15:30:22",
    response: {
      status: 200,
      message: "Webhook received successfully"
    },
    payload: {
      sale_id: "123",
      amount: 1500.00,
      customer: "John Doe"
    }
  },
  {
    id: 2,
    webhookId: 1,
    event: "sale.approved",
    status: "error",
    timestamp: "2024-02-20 15:29:15",
    response: {
      status: 500,
      message: "Internal server error"
    },
    payload: {
      sale_id: "122",
      amount: 997.00,
      customer: "Jane Smith"
    },
    retries: 2
  },
  {
    id: 3,
    webhookId: 2,
    event: "sale.refunded",
    status: "pending",
    timestamp: "2024-02-20 15:28:45",
    payload: {
      sale_id: "121",
      amount: 2997.00,
      customer: "Bob Wilson"
    },
    retries: 1
  }
];

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  inactive: "bg-gray-500/10 text-gray-500"
};

const logStatusColors = {
  success: "text-green-500",
  error: "text-red-500",
  pending: "text-yellow-500"
};

const logStatusIcons = {
  success: CheckCircle2,
  error: XCircle,
  pending: AlertCircle
};

export default function Webhooks() {
  const { isDarkMode } = useContext(ThemeContext);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<number | null>(null);
  const [editingWebhook, setEditingWebhook] = useState<typeof webhooks[0] | null>(null);

  const handleOpenLogs = (webhookId: number) => {
    setSelectedWebhook(webhookId);
    setIsLogsModalOpen(true);
  };

  const handleEditWebhook = (webhook: typeof webhooks[0]) => {
    setEditingWebhook(webhook);
    setIsWebhookModalOpen(true);
  };

  const handleTestWebhook = async (webhookId: number) => {
    // Implement webhook test logic
    console.log('Testing webhook:', webhookId);
  };

  return (
    <>
      <PageHeader
        title="Webhooks"
        description="Gerencie suas integrações via webhook"
      >
        <button 
          onClick={() => setIsWebhookModalOpen(true)}
          className="bg-[var(--primary-color)] text-white px-4 py-1.5 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Novo webhook</span>
        </button>
      </PageHeader>

      <div className="p-4 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="text-blue-500" size={20} />
              <span className="text-sm text-gray-400">Total de webhooks</span>
            </div>
            <p className="text-2xl font-bold">12</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight className="text-green-500" size={20} />
              <span className="text-sm text-gray-400">Taxa de sucesso</span>
            </div>
            <p className="text-2xl font-bold">98.5%</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <ArrowDownRight className="text-red-500" size={20} />
              <span className="text-sm text-gray-400">Taxa de falha</span>
            </div>
            <p className="text-2xl font-bold">1.5%</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <History className="text-[var(--primary-color)]" size={20} />
              <span className="text-sm text-gray-400">Execuções hoje</span>
            </div>
            <p className="text-2xl font-bold">1.247</p>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
          {/* Filters */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className={`flex-1 flex items-center gap-2 ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-100'} px-3 py-2 rounded-lg`}>
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar webhook..."
                  className="bg-transparent border-none focus:outline-none text-sm flex-1 text-gray-400 placeholder-gray-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className={`flex items-center gap-2 ${isDarkMode ? 'bg-[#1E1E2E] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-gray-400 transition-colors`}>
                  <Filter size={20} />
                  <span className="text-sm">Filtros</span>
                </button>
                <button className={`flex items-center gap-2 ${isDarkMode ? 'bg-[#1E1E2E] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-gray-400 transition-colors`}>
                  <span className="text-sm">Última semana</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Nome</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">URL</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Eventos</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Última execução</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Taxa de sucesso</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((webhook) => (
                  <tr key={webhook.id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[#1E1E2E]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <td className="p-4">
                      <span className="text-sm font-medium">{webhook.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400">{webhook.url}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm px-2 py-1 rounded-full ${statusColors[webhook.status as keyof typeof statusColors]}`}>
                        {webhook.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event, index) => (
                          <span 
                            key={index}
                            className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-100'}`}
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400">{webhook.lastExecution}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400">{webhook.successRate}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleTestWebhook(webhook.id)}
                          className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                          title="Testar webhook"
                        >
                          <Play size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenLogs(webhook.id)}
                          className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                          title="Ver logs"
                        >
                          <History size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditWebhook(webhook)}
                          className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                          title="Mais ações"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <WebhookModal
        isOpen={isWebhookModalOpen}
        onClose={() => {
          setIsWebhookModalOpen(false);
          setEditingWebhook(null);
        }}
        webhook={editingWebhook}
      />

      <WebhookLogsModal
        isOpen={isLogsModalOpen}
        onClose={() => {
          setIsLogsModalOpen(false);
          setSelectedWebhook(null);
        }}
        webhookId={selectedWebhook}
        logs={logs.filter(log => log.webhookId === selectedWebhook)}
      />
    </>
  );
}