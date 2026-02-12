import React, { useContext } from 'react';
import { X, Truck, MapPin, Clock, DollarSign, Package } from 'lucide-react';
import { ThemeContext } from '../lib/theme';

interface ViewShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: {
    id: number;
    name: string;
    carrier: string;
    type: string;
    price: number;
    estimatedDays: string;
    regions: string[];
    status: string;
    weight: { min: number; max: number };
    dimensions: { maxLength: number; maxWidth: number; maxHeight: number };
  } | null;
}

export function ViewShippingModal({ isOpen, onClose, method }: ViewShippingModalProps) {
  const { isDarkMode } = useContext(ThemeContext);
  
  if (!isOpen || !method) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl w-full max-w-2xl border max-h-[90vh] overflow-y-auto`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Detalhes do Método de Frete</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Truck className="text-blue-500" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold mb-1">{method.name}</h4>
              <p className="text-sm text-gray-400">{method.carrier}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm px-2 py-1 rounded-full bg-green-500/10 text-green-500`}>
                  Ativo
                </span>
                <span className="text-sm px-2 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                  {method.type}
                </span>
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-green-500" size={20} />
                <span className="text-sm text-gray-400">Preço</span>
              </div>
              <p className="text-xl font-bold">{formatCurrency(method.price)}</p>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-blue-500" size={20} />
                <span className="text-sm text-gray-400">Prazo de Entrega</span>
              </div>
              <p className="text-xl font-bold">{method.delivery_time}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className="w-full bg-[var(--primary-color)] text-white py-2 px-4 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}