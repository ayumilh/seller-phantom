import React, { useContext, useEffect, useState } from 'react';
import { 
  Plus,
  Search,
  Filter,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Package,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Copy,
  Settings,
  BarChart3,
  Archive
} from 'lucide-react';
import { ThemeContext } from '../lib/theme';
import {toast} from 'sonner';
import { PageHeader } from '../components/PageHeader';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { ViewShippingModal } from '../components/ViewShippingModal';
import { CreateShippingModal } from '../components/CreateShippingModal';
import { EditShippingModal } from '../components/EditShippingModal';
import { checkoutService } from '../services/checkoutService';
import { Loading } from '../components/Loading';

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  inactive: "bg-gray-500/10 text-gray-500"
};

export default function Shipping() {
  const { isDarkMode } = useContext(ThemeContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<typeof shippingMethods[0] | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [shippingMethods, setShippingMethods] = useState<{
    metrics: {
      activeMethods: number;
      averagePrice: string;
      averageDelivery: number;
    };
    shippingOptions: any[];
  }>({ metrics: { activeMethods: 0, averagePrice: '', averageDelivery: 0}, shippingOptions: [] });

  const fetchShipping = async () => {
    try {
      const data = await checkoutService.getUserShippingOptions();
      setShippingMethods(data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      
      //alterar if depois de padronizar
      const error = err as { response?: { data?: { message?: string, erro?: string, error?: string } } };
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.erro || 
                          error?.response?.data?.error ||
                          'Erro ao carregar métodos de envio';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleView = (methodId: number) => {
    const method = shippingMethods.shippingOptions.find(m => m.id === methodId);
    if (method) {
      setSelectedMethod(method);
      setIsViewModalOpen(true);
    }
    setShowDropdown(null);
  };

  const handleEdit = (methodId: number) => {
    const method = shippingMethods.shippingOptions.find(m => m.id === methodId);
    if (method) {
      setSelectedMethod(method);
      setIsEditModalOpen(true);
    }
    console.log('Editing shipping method:', methodId);
    setShowDropdown(null);
  };

  const handleDelete = (methodId: number) => {
    setMethodToDelete(methodId);
    setIsDeleteModalOpen(true);
    setShowDropdown(null);
  };

  const confirmDelete = async () => {
    if (methodToDelete) {
      checkoutService.deleteShipping(methodToDelete);
      try {
        await checkoutService.deleteShipping(methodToDelete);
        toast.success('Método de entrega excluído!');
        setLoading(true);
        await fetchShipping();
      } catch (err) {
        console.error('Erro ao excluir produto:', err);
        
        //alterar if depois de padronizar
        const error = err as { response?: { data?: { message?: string, erro?: string, error?: string } } };
        const errorMessage = error?.response?.data?.message || 
                            error?.response?.data?.erro || 
                            error?.response?.data?.error ||
                            'Erro ao excluir método de entrega';
        
        toast.error(errorMessage);
      } finally{
        setMethodToDelete(null);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <PageHeader
        title="Fretes"
        description="Gerencie métodos de entrega e frete"
      >
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-[var(--primary-color)] text-white px-4 py-1.5 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Novo método</span>
        </button>
      </PageHeader>

      <div className="p-4 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Truck className="text-blue-500" size={20} />
              <span className="text-sm text-gray-400">Métodos ativos</span>
            </div>
            <p className="text-2xl font-bold">{shippingMethods.metrics.activeMethods}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="text-green-500" size={20} />
              <span className="text-sm text-gray-400">Frete médio</span>
            </div>
            <p className="text-2xl font-bold">{shippingMethods.metrics.averagePrice}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="text-[var(--primary-color)]" size={20} />
              <span className="text-sm text-gray-400">Prazo médio</span>
            </div>
            <p className="text-2xl font-bold">{shippingMethods.metrics.averageDelivery}</p>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Método</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Preço</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Prazo</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {shippingMethods.shippingOptions.map((method) => (
                  <tr key={method.id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[#1E1E2E]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Truck className="text-blue-500" size={20} />
                        </div>
                        <span className="text-sm font-medium">{method.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium">{formatCurrency(method.price)}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400">{method.delivery_time}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm px-2 py-1 rounded-full bg-green-500/10 text-green-500`}>
                        Ativo
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button 
                          onClick={() => handleView(method.id)}
                          className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                          title="Visualizar método"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEdit(method.id)}
                          className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                          title="Editar método"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(method.id)}
                          className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                          title="Editar método"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowDropdown(null)}
        />
      )}

      <ViewShippingModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedMethod(null);
        }}
        method={selectedMethod}
      />

      <CreateShippingModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
        }}
        onSuccess={() => {
          fetchShipping();
          toast.success('Frete criado com sucesso!');
        }}
      />

      <EditShippingModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        shipping={selectedMethod}
        onSuccess={() => {
          fetchShipping();
          toast.success('Frete atualizado com sucesso!');
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMethodToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Excluir método de frete"
        message="Tem certeza que deseja excluir este método de frete? Esta ação não pode ser desfeita e afetará todos os pedidos que usam este método."
      />
    </>
  );
}