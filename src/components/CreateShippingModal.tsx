import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { ThemeContext } from '../lib/theme';
import { toast } from 'sonner';
import { checkoutService } from '../services/checkoutService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateShippingModal({ isOpen, onClose, onSuccess }: Props) {
  const { isDarkMode } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const handleCreate = async () => {
    if (!name || !price || !deliveryTime) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await checkoutService.createShipping({
        name,
        price: parseFloat(price),
        delivery_time: deliveryTime,
      });

      toast.success('Frete criado com sucesso!');
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao criar frete');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl w-full max-w-md p-6 border`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Novo Método de Frete</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-400">Nome</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`mt-1 w-full rounded-lg border-2 px-3 py-2 text-sm ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} focus:border-[var(--primary-color)]`}
              placeholder="Ex: Frete Rápido SP"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-400">Preço (R$)</span>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className={`mt-1 w-full rounded-lg border-2 px-3 py-2 text-sm ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} focus:border-[var(--primary-color)]`}
              placeholder="Ex: 19.90"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-400">Prazo de entrega</span>
            <input
              type="text"
              value={deliveryTime}
              onChange={e => setDeliveryTime(e.target.value)}
              className={`mt-1 w-full rounded-lg border-2 px-3 py-2 text-sm ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} focus:border-[var(--primary-color)]`}
              placeholder="Ex: 3-5 dias úteis"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCreate}
            className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
          >
            Criar Frete
          </button>
        </div>
      </div>
    </div>
  );
}
