import React, { useContext } from 'react';
import { 
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronRight,
  BadgeDollarSign,
  CreditCard,
  Wallet,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import { PageHeader } from '../components/PageHeader';
import { generateCustomers } from '../lib/mockData';

const customers = generateCustomers(10);

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  inactive: "bg-gray-500/10 text-gray-500"
};

export default function Customers() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Gerencie seus clientes"
      >
        <div className="flex items-center gap-2">
          <button className={`${isDarkMode ? 'bg-[var(--card-background)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-1.5 rounded-lg text-gray-400 transition-colors`}>
            <Download size={20} />
          </button>
          <button 
            onClick={() => navigate('/clientes/novo')}
            className="bg-[var(--primary-color)] text-white px-4 py-1.5 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors"
          >
            Novo cliente
          </button>
        </div>
      </PageHeader>

      <div className="p-4 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <User className="text-blue-500" size={20} />
              <span className="text-sm text-gray-400">Total de clientes</span>
            </div>
            <p className="text-2xl font-bold">1.572</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <BadgeDollarSign className="text-green-500" size={20} />
              <span className="text-sm text-gray-400">Ticket médio</span>
            </div>
            <p className="text-2xl font-bold">R$ 368,86</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="text-[var(--primary-color)]" size={20} />
              <span className="text-sm text-gray-400">Taxa de retenção</span>
            </div>
            <p className="text-2xl font-bold">85%</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="text-pink-500" size={20} />
              <span className="text-sm text-gray-400">Churn rate</span>
            </div>
            <p className="text-2xl font-bold">2.4%</p>
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
                  placeholder="Buscar cliente..."
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
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Cliente</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Total gasto</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Transações</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Última compra</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[#1E1E2E]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-400">{customer.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium">{customer.totalSpent}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm px-2 py-1 rounded-full ${statusColors[customer.status as keyof typeof statusColors]}`}>
                        {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{customer.transactions}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400">{customer.lastPurchase}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button className={`text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} p-2 rounded-lg transition-colors`}>
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}