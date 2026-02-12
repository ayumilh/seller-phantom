import React, { useState, useContext } from 'react';
import { 
  Download,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { WithdrawModal } from '../components/WithdrawModal';
import { ExpenseModal } from '../components/ExpenseModal';
import { ThemeContext } from '../lib/theme.ts';
import { PageHeader } from '../components/PageHeader';

const data = [
  { date: '19/02/2024', income: 30000, expenses: 15000 },
  { date: '18/02/2024', income: 35000, expenses: 18000 },
  { date: '17/02/2024', income: 32000, expenses: 16000 },
  { date: '16/02/2024', income: 40000, expenses: 20000 },
  { date: '15/02/2024', income: 38000, expenses: 19000 },
  { date: '14/02/2024', income: 42000, expenses: 21000 },
  { date: '13/02/2024', income: 45000, expenses: 22500 }
];

const transactions = [
  {
    id: 1,
    type: 'income',
    description: 'Pagamento - João Silva',
    amount: 'R$ 1.500,00',
    date: '2024-02-20 15:30'
  },
  {
    id: 2,
    type: 'expense',
    description: 'Taxa de processamento',
    amount: 'R$ 45,00',
    date: '2024-02-20 15:30'
  },
  {
    id: 3,
    type: 'income',
    description: 'Pagamento - Maria Santos',
    amount: 'R$ 2.300,00',
    date: '2024-02-20 14:45'
  }
];

export default function Financial() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <>
      <PageHeader
        title="Financeiro"
        description="Gerencie suas finanças"
      >
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className={`flex items-center gap-2 ${isDarkMode ? 'bg-[#1E1E2E] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-1.5 rounded-lg text-gray-400 transition-colors`}
          >
            <Plus size={20} />
            <span>Nova despesa</span>
          </button>
          <button className={`${isDarkMode ? 'bg-[#1E1E2E] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-1.5 rounded-lg text-gray-400 transition-colors`}>
            <Download size={20} />
          </button>
          <button 
            onClick={() => setIsWithdrawModalOpen(true)}
            className="bg-[var(--primary-color)] text-white px-4 py-1.5 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Solicitar saque
          </button>
        </div>
      </PageHeader>

      <div className="p-4 lg:p-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <span className="text-sm text-gray-400">Saldo total</span>
            <p className="text-2xl font-bold mt-1">R$ 254.111,34</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>+2.5%</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <span className="text-sm text-gray-400">Receitas (mês)</span>
            <p className="text-2xl font-bold mt-1">R$ 579.667,46</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>+12.5%</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <span className="text-sm text-gray-400">Despesas (mês)</span>
            <p className="text-2xl font-bold mt-1">R$ 24.890,12</p>
            <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
              <ArrowDownRight size={16} />
              <span>-1.2%</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <span className="text-sm text-gray-400">Taxa média</span>
            <p className="text-2xl font-bold mt-1">3.2%</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>+0.3%</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-6 rounded-xl border`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-1">Fluxo de caixa</h2>
              <p className="text-sm text-gray-400">Acompanhe suas receitas e despesas</p>
            </div>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-[#1E1E2E] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-1.5 rounded-lg cursor-pointer transition-colors`}>
              <span className="text-sm text-gray-400">Última semana</span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid stroke={isDarkMode ? '#1E1E2E' : '#f0f0f0'} strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#4B5563" 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#4B5563" 
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#22C55E" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
          <div className={`p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className={`flex-1 flex items-center gap-2 ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-100'} px-3 py-2 rounded-lg`}>
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar transação..."
                  className="bg-transparent border-none focus:outline-none text-sm flex-1 text-gray-400 placeholder-gray-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className={`flex items-center gap-2 ${isDarkMode ? 'bg-[#1E1E2E] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-lg text-gray-400 transition-colors`}>
                  <Filter size={20} />
                  <span className="text-sm">Filtros</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Descrição</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Valor</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Data</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[#1E1E2E]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {transaction.type === 'income' ? (
                          <ArrowUpRight size={16} className="text-green-500" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-500" />
                        )}
                        <span className="text-sm">{transaction.description}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.type === 'expense' ? '- ' : ''}{transaction.amount}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400">{transaction.date}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-gray-400 hover:text-gray-300 transition-colors">
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

      <WithdrawModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </>
  );
}