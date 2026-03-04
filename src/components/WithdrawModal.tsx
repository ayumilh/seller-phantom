import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { X, Copy, CheckCircle2 } from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const intl = useIntl();
  const { isDarkMode } = useContext(ThemeContext);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-[#12121E] border-white/5' : 'bg-white border-gray-200'} rounded-xl w-full max-w-lg border`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{intl.formatMessage({ id: 'modal.withdraw.title' })}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`p-4 ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-50'} rounded-lg`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.withdraw.availableBalance' })}</span>
              <span className="text-lg font-bold">R$ 135.439,86</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {intl.formatMessage({ id: 'modal.withdraw.pixKey' })}
              </label>
              <input
                type="text"
                className={`w-full h-12 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-base px-4`}
                placeholder={intl.formatMessage({ id: 'modal.withdraw.pixKeyPlaceholder' })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {intl.formatMessage({ id: 'modal.withdraw.amountLabel' })}
              </label>
              <input
                type="text"
                className={`w-full h-12 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-base px-4`}
                placeholder={intl.formatMessage({ id: 'modal.withdraw.amountPlaceholder' })}
              />
            </div>

            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-500 mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-green-500">{intl.formatMessage({ id: 'modal.withdraw.instant' })}</p>
                  <p className="text-xs text-gray-400">{intl.formatMessage({ id: 'modal.withdraw.instantDesc' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
          <button className="w-full bg-purple-500 text-white h-12 rounded-lg hover:bg-purple-600 transition-colors font-medium">
            {intl.formatMessage({ id: 'modal.withdraw.request' })}
          </button>
        </div>
      </div>
    </div>
  );
}