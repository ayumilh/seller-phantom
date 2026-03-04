import React, { useContext, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { X, Globe, Key } from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhook?: {
    id: number;
    name: string;
    url: string;
    events: string[];
    status: string;
  } | null;
}

const getAvailableEvents = (intl: ReturnType<typeof useIntl>) => ({
  [intl.formatMessage({ id: 'modal.webhook.sales' })]: [
    { id: 'sale.created', labelKey: 'modal.webhook.saleCreated' },
    { id: 'sale.approved', labelKey: 'modal.webhook.saleApproved' },
    { id: 'sale.canceled', labelKey: 'modal.webhook.saleCanceled' },
    { id: 'sale.refunded', labelKey: 'modal.webhook.saleRefunded' }
  ],
  [intl.formatMessage({ id: 'modal.webhook.financial' })]: [
    { id: 'deposit.created', labelKey: 'modal.webhook.depositCreated' },
    { id: 'withdrawal.requested', labelKey: 'modal.webhook.withdrawalRequested' },
    { id: 'withdrawal.completed', labelKey: 'modal.webhook.withdrawalCompleted' }
  ],
  [intl.formatMessage({ id: 'modal.webhook.customers' })]: [
    { id: 'customer.created', labelKey: 'modal.webhook.customerCreated' },
    { id: 'customer.updated', labelKey: 'modal.webhook.customerUpdated' },
    { id: 'customer.deleted', labelKey: 'modal.webhook.customerDeleted' }
  ],
  [intl.formatMessage({ id: 'modal.webhook.products' })]: [
    { id: 'product.created', labelKey: 'modal.webhook.productCreated' },
    { id: 'product.updated', labelKey: 'modal.webhook.productUpdated' },
    { id: 'product.deleted', labelKey: 'modal.webhook.productDeleted' }
  ]
});

export function WebhookModal({ isOpen, onClose, webhook }: WebhookModalProps) {
  const intl = useIntl();
  const { isDarkMode } = useContext(ThemeContext);
  const availableEvents = getAvailableEvents(intl);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [status, setStatus] = useState('active');

  useEffect(() => {
    if (webhook) {
      setName(webhook.name);
      setUrl(webhook.url);
      setSelectedEvents(webhook.events);
      setStatus(webhook.status);
    } else {
      setName('');
      setUrl('');
      setAuthToken('');
      setSelectedEvents([]);
      setStatus('active');
    }
  }, [webhook]);
  
  if (!isOpen) return null;

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement webhook creation/update logic
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-[#12121E] border-white/5' : 'bg-white border-gray-200'} rounded-xl w-full max-w-2xl border`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {webhook ? intl.formatMessage({ id: 'modal.webhook.edit' }) : intl.formatMessage({ id: 'modal.webhook.new' })}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'modal.webhook.name' })}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                  placeholder={intl.formatMessage({ id: 'modal.webhook.namePlaceholder' })}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'modal.webhook.url' })}</span>
                <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-purple-500 px-3`}>
                  <Globe size={16} className="text-gray-400" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                    placeholder={intl.formatMessage({ id: 'modal.webhook.urlPlaceholder' })}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'modal.webhook.authKey' })}</span>
                <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-purple-500 px-3`}>
                  <Key size={16} className="text-gray-400" />
                  <input
                    type="text"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                    placeholder={intl.formatMessage({ id: 'modal.webhook.authPlaceholder' })}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {intl.formatMessage({ id: 'modal.webhook.authHelp' })}
                </p>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'modal.webhook.status' })}</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                >
                  <option value="active">{intl.formatMessage({ id: 'modal.webhook.active' })}</option>
                  <option value="inactive">{intl.formatMessage({ id: 'modal.webhook.inactive' })}</option>
                </select>
              </label>

              <div>
                <span className="text-sm font-medium text-gray-400 block mb-2">{intl.formatMessage({ id: 'modal.webhook.events' })}</span>
                <div className="space-y-4">
                  {Object.entries(availableEvents).map(([category, events]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {events.map((event) => (
                          <label
                            key={event.id}
                            className={`
                              flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors
                              ${selectedEvents.includes(event.id)
                                ? 'border-purple-500 bg-purple-500/10'
                                : `${isDarkMode ? 'border-[#1E1E2E] hover:border-purple-500/50' : 'border-gray-200 hover:border-purple-500/50'}`}
                            `}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={selectedEvents.includes(event.id)}
                              onChange={() => toggleEvent(event.id)}
                            />
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              selectedEvents.includes(event.id)
                                ? 'bg-purple-500 border-purple-500'
                                : 'border-gray-400'
                            }`}>
                              {selectedEvents.includes(event.id) && (
                                <svg className="w-3 h-3 text-white\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor">
                                  <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm">{intl.formatMessage({ id: event.labelKey })}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
            <button 
              type="submit"
              className="w-full bg-purple-500 text-white h-12 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              disabled={selectedEvents.length === 0}
            >
              {webhook ? intl.formatMessage({ id: 'modal.webhook.saveChanges' }) : intl.formatMessage({ id: 'modal.webhook.create' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}