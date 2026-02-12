import React, { useEffect, useState } from 'react';
import { X, Mail, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { settingService } from '../services/settingsService';

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailNotificationModal({ isOpen, onClose }: EmailNotificationModalProps) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email_deposito_recebido: false,
    email_saque_realizado: false,
    email_credenciais_geradas: false,
  });

  useEffect(() => {
    if (isOpen) {
      loadPreferences();
    }
  }, [isOpen]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const response = await settingService.getEmailNotifications();
      setNotifications(response);
    } catch (err) {
      toast.error('Erro ao carregar preferências de notificação.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingService.updateEmailNotifications(notifications);
      toast.success('Preferências salvas com sucesso!');
      onClose();
    } catch (err) {
      toast.error('Erro ao salvar preferências.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Loader className="animate-spin text-[var(--primary-color)] mb-4" size={40} />
        <p className="text-gray-400">Carregando preferências...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="rounded-xl w-full max-w-lg border"
        style={{
          backgroundColor: isDarkMode ? 'var(--background-color)' : 'white',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#E5E7EB',
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: isDarkMode ? '#1E1E2E' : '#E5E7EB' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold" style={{ color: isDarkMode ? 'white' : 'black' }}>
              Notificações por E-mail
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Fechar">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {[
            { key: 'email_deposito_recebido', label: 'Depósito recebido' },
            { key: 'email_saque_realizado', label: 'Saque realizado' },
            { key: 'email_credenciais_geradas', label: 'Novas credenciais geradas' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span style={{ color: isDarkMode ? 'white' : 'black' }}>{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={() => handleToggle(key as keyof typeof notifications)}
                />
                <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none transition-colors
                  ${isDarkMode
                    ? 'bg-gray-700 peer-checked:bg-blue-600'
                    : 'bg-gray-300 peer-checked:bg-blue-600'}
                `}></div>
                <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  peer-checked:translate-x-full`}>
                </div>
              </label>
            </div>
          ))}
        </div>


        <div className="p-6 border-t" style={{ borderColor: isDarkMode ? '#1E1E2E' : '#E5E7EB' }}>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg"
              style={{
                backgroundColor: isDarkMode ? 'var(--card-background)' : '#F3F4F6',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'var(--primary-light)' : '#E5E7EB';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'var(--card-background)' : '#F3F4F6';
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2 px-4 text-white rounded-lg"
              style={{ backgroundColor: 'var(--primary-color)' }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1e52b9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-color)';
              }}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}