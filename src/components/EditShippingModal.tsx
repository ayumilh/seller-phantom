import React, { useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ThemeContext } from '../lib/theme';
import { checkoutService } from '../services/checkoutService';
import { toast } from 'sonner';

interface EditShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipping: {
    id: number;
    name: string;
    price: number;
    delivery_time: string;
  } | null;
  onSuccess: () => void;
}

export function EditShippingModal({ isOpen, onClose, shipping, onSuccess }: EditShippingModalProps) {
  const { isDarkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    delivery_time: ''
  });

  useEffect(() => {
    if (shipping) {
      setFormData({
        name: shipping.name,
        price: shipping.price.toString(),
        delivery_time: shipping.delivery_time
      });
    }
  }, [shipping]);

  if (!isOpen || !shipping) return null;

  const handleSubmit = async () => {
    try {
      await checkoutService.updateShippingById(shipping.id, {
        ...formData,
        price: parseFloat(formData.price)
      });
      toast.success('Frete atualizado com sucesso!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar frete');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl w-full max-w-lg border shadow-lg`}>
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold">Editar Método de Frete</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-400">Nome</span>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`mt-1 block w-full rounded-lg border-2 text-sm px-3 py-2 ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} focus:border-[var(--primary-color)] focus:ring-0`}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-400">Preço (R$)</span>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              className={`mt-1 block w-full rounded-lg border-2 text-sm px-3 py-2 ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} focus:border-[var(--primary-color)] focus:ring-0`}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-400">Prazo de Entrega</span>
            <input
              type="text"
              value={formData.delivery_time}
              onChange={e => setFormData({ ...formData, delivery_time: e.target.value })}
              placeholder="Ex: 5-10 dias úteis"
              className={`mt-1 block w-full rounded-lg border-2 text-sm px-3 py-2 ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} focus:border-[var(--primary-color)] focus:ring-0`}
            />
          </label>
        </div>

        <div className="p-6 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/90"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}
