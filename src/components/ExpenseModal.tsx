import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { X, Calendar } from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const expenseCategoryKeys = [
  { id: 'ads', labelKey: 'modal.expense.ads' },
  { id: 'tools', labelKey: 'modal.expense.tools' },
  { id: 'freelancers', labelKey: 'modal.expense.freelancers' },
  { id: 'marketing', labelKey: 'modal.expense.marketing' },
  { id: 'infrastructure', labelKey: 'modal.expense.infrastructure' },
  { id: 'other', labelKey: 'modal.expense.other' }
] as const;

export function ExpenseModal({ isOpen, onClose }: ExpenseModalProps) {
  const intl = useIntl();
  const { isDarkMode } = useContext(ThemeContext);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-[#12121E] border-white/5' : 'bg-white border-gray-200'} rounded-xl w-full max-w-lg border`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{intl.formatMessage({ id: 'modal.expense.title' })}</h3>
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
              <span className="text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'modal.expense.name' })}</span>
              <input
                type="text"
                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                placeholder={intl.formatMessage({ id: 'modal.expense.namePlaceholder' })}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'modal.expense.amount' })}</span>
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
              <span className="text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'modal.expense.date' })}</span>
              <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-purple-500 px-3`}>
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'modal.expense.category' })}</span>
              <select
                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
              >
                <option value="">{intl.formatMessage({ id: 'modal.expense.selectCategory' })}</option>
                {expenseCategoryKeys.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {intl.formatMessage({ id: cat.labelKey })}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'modal.expense.notes' })}</span>
              <textarea
                rows={3}
                className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                placeholder={intl.formatMessage({ id: 'modal.expense.notesPlaceholder' })}
              />
            </label>
          </div>
        </div>

        <div className={`p-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
          <button className="w-full bg-purple-500 text-white h-12 rounded-lg hover:bg-purple-600 transition-colors font-medium">
            {intl.formatMessage({ id: 'modal.expense.registerButton' })}
          </button>
        </div>
      </div>
    </div>
  );
}