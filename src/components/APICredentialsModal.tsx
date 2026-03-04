import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { X, Key, Copy, CheckCircle2, AlertTriangle, Loader } from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';
import { settingService } from '../services/settingsService';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
interface APICredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function APICredentialsModal({ isOpen, onClose }: APICredentialsModalProps) {
  const intl = useIntl();
  const isDarkMode  = useSelector((state) => state.theme.isDarkMode);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState<{ clientId: string; clientSecret: string } | null>(null);
  const [loadingCredetial, setLoadingCredential] = useState(false);
  if (!isOpen) return null;

  const handleGenerateCredentials = async () => {
    try {
      setLoadingCredential(true);
      const data = await settingService.generateClientCredentials();

      setCredentials({
        clientId: data.client_id,
        clientSecret: data.client_secret
      });

      localStorage.setItem('client_id', data.client_id);
      localStorage.setItem('client_secret', data.client_secret);

      setShowConfirmation(false);
      setShowCredentials(true);
    } catch (err) {
      console.error('Erro ao gerar credenciais:', err);
      
      //alterar if depois de padronizar
      const error = err as { response?: { data?: { message?: string, erro?: string, error?: string } } };
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.erro || 
                          error?.response?.data?.error ||
                          intl.formatMessage({ id: 'modal.apiCredentials.error' });
      
      toast.error(errorMessage);
    }
    finally{
      setLoadingCredential(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  if(loadingCredetial){
    return (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Loader className="animate-spin text-[var(--primary-color)] mb-4" size={40} />
        <p className="text-gray-400">{intl.formatMessage({ id: 'modal.apiCredentials.loading' })}</p>
    </div>);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`rounded-xl w-full max-w-lg border`}
        style={{
          backgroundColor: isDarkMode ? 'var(--background-color)' : 'white',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#E5E7EB', // border-white/5 or border-gray-200
        }}
      >
        <div
          className="p-6 border-b"
          style={{
            borderColor: isDarkMode ? '#1E1E2E' : '#E5E7EB', // same border gray-200
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold" style={{ color: isDarkMode ? 'white' : 'black' }}>
              {intl.formatMessage({ id: 'modal.apiCredentials.title' })}
            </h3>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{
                color: 'gray'
              }}
              aria-label={intl.formatMessage({ id: 'common.close' })}
            >
              <X size={24} className="text-gray-400 hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {showConfirmation && (
            <div className="text-center space-y-4" style={{ color: isDarkMode ? 'white' : 'black' }}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(36, 107, 222, 0.1)' /* primary-light */ }}
              >
                <Key size={32} className="text-[var(--primary-color)]" />
              </div>
              <h4 className="text-lg font-medium" style={{ color: isDarkMode ? 'white' : 'black' }}>
                {intl.formatMessage({ id: 'modal.apiCredentials.generateNew' })}
              </h4>
              <p
                className="text-sm"
                style={{ color: isDarkMode ? 'rgba(156,163,175,1)' : 'rgba(107,114,128,1)' }} // text-gray-400
              >
                {intl.formatMessage({ id: 'modal.apiCredentials.warning' })}
              </p>
              <div
                className="p-4 rounded-lg mt-4"
                style={{ backgroundColor: 'rgba(250,204,21,0.1)' /* amarelo claro */, color: 'rgb(202,138,4)' }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5" size={20} style={{ color: 'rgb(202,138,4)' }} />
                  <p className="text-sm text-left" style={{ color: 'rgb(202,138,4)' }}>
                    {intl.formatMessage({ id: 'modal.apiCredentials.cannotUndo' })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showCredentials && credentials && (
            <div className="space-y-6">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(34,197,94,0.1)' /* verde claro */ }}
                >
                  <CheckCircle2 size={32} style={{ color: '#22c55e' }} />
                </div>
                <h4
                  className="text-lg font-medium"
                  style={{ color: isDarkMode ? 'white' : 'black' }}
                >
                  {intl.formatMessage({ id: 'modal.apiCredentials.success' })}
                </h4>
                <p
                  className="text-sm mt-2"
                  style={{ color: isDarkMode ? 'rgba(156,163,175,1)' : 'rgba(107,114,128,1)' }}
                >
                  {intl.formatMessage({ id: 'modal.apiCredentials.storeSafe' })}
                </p>
              </div>

              <div className="space-y-4">
                {/* Client ID */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: isDarkMode ? 'rgba(156,163,175,1)' : 'rgba(107,114,128,1)' }}
                  >
                    {intl.formatMessage({ id: 'modal.apiCredentials.clientId' })}
                  </label>
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg overflow-x-auto max-w-full"
                    style={{
                      backgroundColor: isDarkMode ? 'var(--card-background)' : '#F9FAFB', // gray-50
                    }}
                  >
                    <code
                      className="flex-1 font-mono text-sm break-all whitespace-pre-wrap"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      {credentials.clientId}
                    </code>
                    <button
                      onClick={() => handleCopy(credentials.clientId)}
                      className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white"
                      style={{
                        backgroundColor: 'transparent',
                        ...(isDarkMode
                          ? { cursor: 'pointer' }
                          : {}),
                      }}
                      onMouseOver={(e) => {
                        if (isDarkMode) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-light)';
                        } else {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#E5E7EB';
                        }
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Client Secret */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: isDarkMode ? 'rgba(156,163,175,1)' : 'rgba(107,114,128,1)' }}
                  >
                    {intl.formatMessage({ id: 'modal.apiCredentials.clientSecret' })}
                  </label>
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg overflow-x-auto max-w-full"
                    style={{
                      backgroundColor: isDarkMode ? 'var(--card-background)' : '#F9FAFB',
                    }}
                  >
                    <code
                      className="flex-1 font-mono text-sm break-all whitespace-pre-wrap"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      {credentials.clientSecret}
                    </code>
                    <button
                      onClick={() => handleCopy(credentials.clientSecret)}
                      className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseOver={(e) => {
                        if (isDarkMode) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-light)';
                        } else {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#E5E7EB';
                        }
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="p-6 border-t"
          style={{ borderColor: isDarkMode ? '#1E1E2E' : '#E5E7EB' }}
        >
          {showConfirmation ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded-lg transition-colors"
                style={{
                  backgroundColor: isDarkMode ? 'var(--card-background)' : '#F3F4F6', // bg-gray-100
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode
                    ? 'var(--primary-light)'
                    : '#E5E7EB'; // hover:bg-gray-200
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode
                    ? 'var(--card-background)'
                    : '#F3F4F6';
                }}
              >
                {intl.formatMessage({ id: 'modal.cancel' })}
              </button>
              <button
                onClick={handleGenerateCredentials}
                className="flex-1 rounded-lg text-white py-2 px-4 transition-colors"
                style={{ backgroundColor: 'var(--primary-color)', cursor: 'pointer' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e52b9'; // tom mais escuro do primary
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                }}
              >
                {intl.formatMessage({ id: 'modal.apiCredentials.generate' })}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full rounded-lg text-white py-2 px-4 transition-colors"
              style={{ backgroundColor: 'var(--primary-color)', cursor: 'pointer' }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1e52b9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-color)';
              }}
            >
              {intl.formatMessage({ id: 'modal.apiCredentials.understood' })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
