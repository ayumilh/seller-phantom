import React, { useContext } from 'react';
import { X, Calendar } from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const expenseCategories = [
  'Anúncios',
  'Ferramentas',
  'Freelancers',
  'Marketing',
  'Infraestrutura',
  'Outros'
];

export function ExpenseModal({ isOpen, onClose }: ExpenseModalProps) {
  const { isDarkMode } = useContext(ThemeContext);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-[#12121E] border-white/5' : 'bg-white border-gray-200'} rounded-xl w-full max-w-lg border`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Cadastrar Despesa</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-400">Nome da despesa</span>
              <input
                type="text"
                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                placeholder="Digite o nome da despesa"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-400">Valor</span>
              <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-purple-500 px-3`}>
                <span className="text-gray-400">R$</span>
                <input
                  type="text"
                  className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                  placeholder="0,00"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-400">Data</span>
              <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-purple-500 px-3`}>
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-400">Categoria</span>
              <select
                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
              >
                <option value="">Selecione uma categoria</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-400">Observações (opcional)</span>
              <textarea
                rows={3}
                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                placeholder="Adicione observações sobre a despesa"
              />
            </label>
          </div>
        </div>

        <div className={`p-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
          <button className="w-full bg-purple-500 text-white h-12 rounded-lg hover:bg-purple-600 transition-colors font-medium">
            Cadastrar despesa
          </button>
        </div>
      </div>
    </div>
  );
}