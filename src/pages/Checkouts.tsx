import React, { useContext, useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus,
  MoreVertical,
  Globe,
  Palette,
  CreditCard,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import {toast} from 'sonner';
import { PageHeader } from '../components/PageHeader';
import { checkoutService } from '../services/checkoutService.ts';
import { Loading } from '../components/Loading.tsx';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export default function Checkouts() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<number | null>(null);

  const fetchCheckouts = async () => {
    try {
      const data = await checkoutService.getUserCheckouts();
      setCheckouts(data);
    } catch (err) {
      console.error('Erro ao buscar checkouts:', err);
      toast.error('Erro ao buscar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const handleDelete = (methodId: number) => {
    setMethodToDelete(methodId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (methodToDelete) {
      try {
        await checkoutService.deleteCheckout(methodToDelete);
        toast.success('Checkout excluído!');
        setLoading(true);
        await fetchCheckouts();
      } catch (err) {
        console.error('Erro ao excluir prodCheckoututo:', err);
        toast.error('Erro ao excluir Checkout');
      } finally{
        setMethodToDelete(null);
      }
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <PageHeader
        title="Checkouts"
        description="Gerencie seus checkouts personalizados"
      >
        <button 
          onClick={() => navigate('/checkouts/novo')}
          className="bg-[var(--primary-color)] text-white px-4 py-1.5 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Novo checkout</span>
        </button>
      </PageHeader>

      <div className="p-4 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="text-blue-500" size={20} />
              <span className="text-sm text-gray-400">Total de checkouts</span>
            </div>
            <p className="text-2xl font-bold">{checkouts.stats.totalCheckouts}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="text-[var(--primary-color)]" size={20} />
              <span className="text-sm text-gray-400">Temas ativos</span>
            </div>
            <p className="text-2xl font-bold">{checkouts.stats.activeThemes}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="text-pink-500" size={20} />
              <span className="text-sm text-gray-400">Conversão média</span>
            </div>
            <p className="text-2xl font-bold">{checkouts.stats.averageConversion}%</p>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
          {/* Checkouts Grid */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkouts.checkouts.map((checkout) => (
              <div key={checkout.id} className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL}${checkout.customization.banner}`} 
                  alt={checkout.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{checkout.name}</h3>
                      <p className="text-sm text-gray-400">{checkout.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/checkout/${checkout.name}`;
                          window.open(url, '_blank');
                        }}
                        className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-200'} rounded-lg transition-colors`}
                      >
                        <Eye size={18} />
                      </button>

                      <button  onClick={() => handleDelete(checkout.id)} className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-200'} rounded-lg transition-colors`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500`}>
                      Ativo
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">
                      {checkout.customization.methods}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMethodToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Excluir página de checkout"
        message="Tem certeza que deseja excluir essa página de checkout? Esta ação não pode ser desfeita."
      />
    </>
  );
}