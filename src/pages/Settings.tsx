import React, { useContext, useEffect, useState } from 'react';
import { 
  CreditCard,
  Lock,
  Bell,
  Mail,
  User,
  ChevronRight,
  Shield,
  Key,
  Smartphone,
  MessageSquare,
  Globe,
  Code,
  Network,
  Wallet,
  FileText,
  Building2,
  Headphones,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import { APICredentialsModal } from '../components/APICredentialsModal';
import { Loading } from '../components/Loading';
import { EmailNotificationModal } from '../components/EmailNotificationModal.tsx';

const settingsSections = [
  /*{
    title: "Perfil",
    icon: User,
    items: [
      { 
        label: "Informações pessoais", 
        description: "Atualize seus dados cadastrais",
        path: "/configuracoes/perfil"
      },
      { 
        label: "Preferências", 
        description: "Configure suas preferências de conta" 
      }
    ]
  },
  {
    title: "Pagamentos",
    icon: CreditCard,
    items: [
      { 
        label: "Métodos de pagamento", 
        description: "Gerencie suas formas de recebimento" 
      },
      { 
        label: "Conta bancária", 
        description: "Gerencie suas contas para saque" 
      }
    ]
  },*/
  {
    title: "Segurança",
    icon: Shield,
    items: [
      /*{ 
        label: "Senha", 
        description: "Altere sua senha de acesso" 
      },
      { 
        label: "Autenticação em dois fatores", 
        description: "Configure a verificação em duas etapas" 
      },*/
      { 
        label: "IPs Autorizados", 
        description: "Gerencie IPs autorizados para saque via API",
        path: "/configuracoes/ip"
      }/*,
      { 
        label: "Dispositivos conectados", 
        description: "Gerencie os dispositivos com acesso" 
      }*/
    ]
  },
  {
    title: "Notificações",
    icon: Bell,
    items: [
      { 
        label: "Email", 
        description: "Configure suas notificações por email",
        action: "openEmailModal"
      }/*,
      { 
        label: "Push", 
        description: "Configure suas notificações push" 
      },
      { 
        label: "SMS", 
        description: "Configure suas notificações por SMS" 
      }*/
    ]
  },
  {
    title: "Integrações",
    icon: Globe,
    items: [
      /*{ 
        label: "Webhooks", 
        description: "Configure seus webhooks",
        path: "/webhooks"
      },*/
      { 
        label: "API", 
        description: "Gerencie suas chaves de API",
        action: "openAPIModal"
      }
    ]
  }
];

export default function Settings() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setLoadingInit(false)}, 1000);

    return () => clearTimeout(timer);
  }, [])
  const handleItemClick = (item: any) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.action === 'openAPIModal') {
      setIsAPIModalOpen(true);
    }
    else if (item.action === 'openEmailModal') {
      setIsEmailModalOpen(true);
    }
  };


  if (loadingInit) {
    return (
      <Loading/>
    );
  }

  return (
    <>
      <header className={`sticky top-0 z-20 bg-[var(--background-color)] px-4 lg:px-8 py-4`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-sm text-gray-400">Gerencie as configurações da sua conta</p>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="space-y-6">
          {settingsSections.map((section, index) => (
            <div key={index} className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
              <div className={`p-4 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <section.icon size={20} className="text-[var(--primary-color)]" />
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>
              </div>
              <div className="divide-y divide-[#1E1E2E]">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => handleItemClick(item)}
                    className={`w-full p-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-[#1E1E2E]/50' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <APICredentialsModal
        isOpen={isAPIModalOpen}
        onClose={() => setIsAPIModalOpen(false)}
      />
      <EmailNotificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </>
  );
}