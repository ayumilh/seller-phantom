import React, { useState, useContext, useEffect } from 'react';
import { 
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2,
  Eye,
  ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';
import { PageHeader } from '../components/PageHeader';
import { ViewSaleModal } from '../components/ViewSaleModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { checkoutService } from '../services/checkoutService.ts';
import { Loading } from '../components/Loading.tsx';

const statusColors = {
  paid: "bg-green-500/10 text-green-500",
  pending: "bg-yellow-500/10 text-yellow-500",
  failed: "bg-red-500/10 text-red-500"
};

const statusTranslations = {
  paid: "Aprovado",
  pending: "Pendente",
  failed: "Falhou"
};

export default function Sales() {
  const navigate = useNavigate();
  const [showAbandonedCarts, setShowAbandonedCarts] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedSale, setSelectedSale] = useState<typeof transactions[0] | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [numberAbandonedCarts, setNumbetAbandonedCarts] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await checkoutService.getSalesAndAbandoned();
      setTransactions(data.transactions);
      setAbandonedCarts(data.carts);
      setNumbetAbandonedCarts(data.count);
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewSale = (sale: typeof transactions[0]) => {
    const saleWithMethod = { ...sale, method: 'pix' };
    setSelectedSale(saleWithMethod);
    console.log(saleWithMethod);
    setIsViewModalOpen(true);
  };

  const handleDeleteSale = (saleId: number) => {
    setSaleToDelete(saleId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (saleToDelete) {
      checkoutService.deleteSale(saleToDelete);
      console.log('Deleting sale:', saleToDelete);
      setSaleToDelete(null);
    }
  };

  const renderMobileCard = (item: any) => (
    <div key={item.id} className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} border rounded-lg p-4 space-y-3`}>
      {/* Header do Card */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}`}>{item.customer}</h3>
          <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.email}</p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button 
            onClick={() => handleViewSale(item)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-[#2A2A3A]' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Ver detalhes"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => handleDeleteSale?.(item.id)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-red-400 hover:bg-[#2A2A3A]' 
                : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
            }`}
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Valor</span>
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.amount}</span>
        </div>
        
        {showAbandonedCarts ? (
          <>
            <div>
              <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Itens</span>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.items} produtos</span>
            </div>
            <div className="col-span-2">
              <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Última atividade</span>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.date}</span>
            </div>
          </>
        ) : (
          <>
            <div>
              <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</span>
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${statusColors[item.status as keyof typeof statusColors]}`}>
                {statusTranslations[item.status as keyof typeof statusTranslations]}
              </span>
            </div>
            <div className="col-span-2">
              <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Data</span>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.date}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (loading) return <Loading />;

  return (
    <>
      <PageHeader
        title="Vendas"
        description="Gerencie todas as suas transações"
      >
        {/* Header Actions - Responsivo */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          {/* Primeira linha - botão principal e contador */}
          <div className="flex items-center gap-2 flex-1">
            <button 
              onClick={() => setShowAbandonedCarts(!showAbandonedCarts)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg transition-colors flex-1 sm:flex-none justify-center sm:justify-start ${
                showAbandonedCarts 
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : `${isDarkMode ? 'bg-[var(--primary-color)] hover:bg-[#2A2A3A] text-white' : 'bg-[var(--primary-color)] hover:bg-gray-200 text-gray-600'}`
              }`}
            >
              <ShoppingCart size={18} />
              <span className="text-sm sm:text-base">
                <span className="hidden sm:inline">Carrinhos abandonados</span>
                <span className="sm:hidden">Carrinhos</span>
              </span>
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-red-500/20 text-red-500 rounded-full">
                {numberAbandonedCarts}
              </span>
            </button>
          </div>
        </div>
      </PageHeader>

      <div className="p-3 sm:p-4 lg:p-8">
        {/* Desktop Table View */}
        <div className={`hidden md:block ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
          <div className="w-full overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                  {showAbandonedCarts ? (
                    <>
                      <th className="text-left p-4 font-medium text-gray-400">Cliente</th>
                      <th className="text-left p-4 font-medium text-gray-400">Valor</th>
                      <th className="text-left p-4 font-medium text-gray-400">Itens</th>
                      <th className="text-left p-4 font-medium text-gray-400">Última atividade</th>
                      <th className="text-right p-4 font-medium text-gray-400">Ações</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left p-4 font-medium text-gray-400">Cliente</th>
                      <th className="text-left p-4 font-medium text-gray-400">Valor</th>
                      <th className="text-left p-4 font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 font-medium text-gray-400">Data</th>
                      <th className="text-right p-4 font-medium text-gray-400">Ações</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {(showAbandonedCarts ? abandonedCarts : transactions || []).map((item) => (
                  <tr key={item.id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[#1E1E2E]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <td className="p-4">
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}`}>{item.customer}</p>
                        <p className={`text-xs truncate max-w-[200px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.email}</p>
                      </div>
                    </td>
                    <td className={`p-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.amount}</td>
                    {showAbandonedCarts ? (
                      <>
                        <td className={`p-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.items} produtos</td>
                        <td className={`p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.date}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[item.status as keyof typeof statusColors]}`}>
                            {statusTranslations[item.status as keyof typeof statusTranslations]}
                          </span>
                        </td>
                        <td className={`p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.date}</td>
                      </>
                    )}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewSale(item)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'text-gray-400 hover:text-white hover:bg-[#2A2A3A]' 
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteSale?.(item.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'text-gray-400 hover:text-red-400 hover:bg-[#2A2A3A]' 
                              : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
                          }`}
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {(showAbandonedCarts ? abandonedCarts : transactions || []).map((item) => 
            renderMobileCard(item)
          )}
        </div>

        {/* Empty State */}
        {(showAbandonedCarts ? abandonedCarts : transactions || []).length === 0 && (
          <div className={`${isDarkMode ? 'bg-[#12121E] border-white/5' : 'bg-white border-gray-200'} rounded-xl border p-8 md:p-16 text-center`}>
            <div className="max-w-md mx-auto">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDarkMode ? 'bg-[#1E1E2E]' : 'bg-gray-100'} flex items-center justify-center`}>
                {showAbandonedCarts ? (
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                ) : (
                  <Eye className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {showAbandonedCarts ? 'Nenhum carrinho abandonado' : 'Nenhuma venda encontrada'}
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {showAbandonedCarts 
                  ? 'Carrinhos abandonados aparecerão aqui quando os clientes não finalizarem a compra.'
                  : 'Suas vendas aparecerão aqui assim que forem realizadas.'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedSale && (
        <ViewSaleModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedSale(null);
          }}
          sale={selectedSale}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSaleToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Excluir venda"
        message="Tem certeza que deseja excluir esta venda? Todos os dados relacionados serão perdidos."
      />
    </>
  );
}