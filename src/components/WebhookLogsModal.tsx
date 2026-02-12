import React, { useContext } from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, RotateCw, ChevronRight } from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';

interface WebhookLog {
  id: number;
  webhookId: number;
  event: string;
  status: 'success' | 'error' | 'pending';
  timestamp: string;
  response?: {
    status: number;
    message: string;
  };
  payload: any;
  retries?: number;
}

interface WebhookLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhookId: number | null;
  logs: WebhookLog[];
}

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

export function WebhookLogsModal({ isOpen, onClose, webhookId, logs }: WebhookLogsModalProps) {
  const { isDarkMode } = useContext(ThemeContext);
  
  if (!isOpen) return null;

  const handleRetry = async (logId: number) => {
    // Implement retry logic
    console.log('Retrying webhook:', logId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-[#12121E] border-white/5' : 'bg-white border-gray-200'} rounded-xl w-full max-w-4xl border`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Logs de Execução</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {logs.map((log) => {
            const StatusIcon = logStatusIcons[log.status];
            
            return (
              <div 
                key={log.id}
                className={`${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-50'} rounded-lg p-4`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={logStatusColors[log.status]} size={16} />
                      <span className="font-medium">{log.event}</span>
                      <span className="text-sm text-gray-400">{log.timestamp}</span>
                    </div>

                    {log.response && (
                      <div className={`text-sm ${
                        log.status === 'success' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        Status: {log.response.status} - {log.response.message}
                      </div>
                    )}

                    {log.retries && log.retries > 0 && (
                      <div className="text-sm text-yellow-500">
                        Tentativas: {log.retries}/3
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRetry(log.id)}
                      className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-200'} rounded-lg transition-colors`}
                      title="Reenviar webhook"
                    >
                      <RotateCw size={16} />
                    </button>
                    <button
                      className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-200'} rounded-lg transition-colors`}
                      title="Ver detalhes"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}