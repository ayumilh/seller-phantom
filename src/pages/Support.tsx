import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { ThemeContext } from '../lib/theme.ts';
import { PageHeader } from '../components/PageHeader';
import { MessageSquare, Send, Paperclip } from 'lucide-react';

export default function Support() {
  const intl = useIntl();
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const categories = [
    intl.formatMessage({ id: 'pages.support.category.payments' }),
    intl.formatMessage({ id: 'pages.support.category.withdrawals' }),
    intl.formatMessage({ id: 'pages.support.category.integrations' }),
    intl.formatMessage({ id: 'pages.support.category.account' }),
    intl.formatMessage({ id: 'pages.support.category.others' })
  ];

  return (
    <>
      <PageHeader
        title={intl.formatMessage({ id: 'pages.support.title' })}
        description={intl.formatMessage({ id: 'pages.support.description' })}
      />

      <div className="p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 space-y-6 border`}>
            <div className="flex items-center gap-4 pb-6 border-b border-gray-700">
              <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-[var(--primary-color)]" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{intl.formatMessage({ id: 'pages.support.newTicket' })}</h2>
                <p className="text-sm text-gray-400">{intl.formatMessage({ id: 'pages.support.newTicketSubtitle' })}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {intl.formatMessage({ id: 'pages.support.category' })}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                >
                  <option value="">{intl.formatMessage({ id: 'pages.support.selectCategory' })}</option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {intl.formatMessage({ id: 'pages.support.subject' })}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                  placeholder={intl.formatMessage({ id: 'pages.support.subjectPlaceholder' })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {intl.formatMessage({ id: 'pages.support.message' })}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className={`w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                  placeholder={intl.formatMessage({ id: 'pages.support.messagePlaceholder' })}
                />
              </div>

              <div className="flex items-center gap-4">
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                  <Paperclip size={20} className="text-gray-400" />
                  <span className="text-sm">{intl.formatMessage({ id: 'pages.support.attachFile' })}</span>
                </button>
                <span className="text-xs text-gray-400">{intl.formatMessage({ id: 'pages.support.maxSize' })}</span>
              </div>
            </div>

            <div className={`pt-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
              <button className="w-full bg-[var(--primary-color)] text-white h-12 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors flex items-center justify-center gap-2">
                <Send size={20} />
                {intl.formatMessage({ id: 'pages.support.sendTicket' })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}