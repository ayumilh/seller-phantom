import React, { useContext } from 'react';
import { 
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronRight,
  Package,
  BadgeDollarSign,
  ShoppingCart,
  TrendingUp,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'sonner';
import { ThemeContext } from '../lib/theme.ts';
import { PageHeader } from '../components/PageHeader';
import { useEffect, useState } from 'react';
import { checkoutService } from '../services/checkoutService.ts';
import { Loading } from '../components/Loading';

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  inactive: "bg-gray-500/10 text-gray-500"
};

export default function Products() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState<{
    metrics: {
      totalProducts: number;
      totalRevenue: string;
      totalSales: number;
      conversionRate: string;
    };
    products: any[];
  }>({ metrics: { totalProducts: 0, totalRevenue: '', totalSales: 0, conversionRate: '' }, products: [] });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [editForm, setEditForm] = React.useState({
    name: '',
    price: '',
    type: 'digital',
    image: ''
  });

  
  const fetchProducts = async () => {
    try {
      const data = await checkoutService.getUserProductSales();
      setProductsData(data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      await checkoutService.deleteProduct(id);
      toast.success('Produto excluído!');
      setLoading(true);
      await fetchProducts();
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      toast.error('Erro ao excluir produto');
    }
  };

  const handleView = async (id: number) => {
    try {
      const data = await checkoutService.getProductById(id);
      setSelectedProduct(data);
    } catch (err) {
      toast.error('Erro ao buscar produto');
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const data = await checkoutService.getProductById(id);
      setEditProduct(data);
      setEditForm({
        name: data.name,
        price: data.price.toString(),
        type: data.type,
        image: data.image || ''
      });
    } catch (err) {
      toast.error('Erro ao buscar produto para edição');
    }
  };



  if (loading) return <Loading />;
  return (
    <>
      <PageHeader
        title="Produtos"
        description="Gerencie seus produtos"
      >
        <div className="flex items-center gap-2">
          <button className={`${isDarkMode ? 'bg-[#1E1E2E] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-1.5 rounded-lg text-gray-400 transition-colors`}>
            <Download size={20} />
          </button>
          <button 
            onClick={() => navigate('/produtos/novo')}
            className="bg-[var(--primary-color)] text-white px-4 py-1.5 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Novo produto
          </button>
        </div>
      </PageHeader>

      <div className="p-4 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Package className="text-blue-500" size={20} />
              <span className="text-sm text-gray-400">Total de produtos</span>
            </div>
            <p className="text-2xl font-bold">{productsData.metrics.totalProducts}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <BadgeDollarSign className="text-green-500" size={20} />
              <span className="text-sm text-gray-400">Receita total</span>
            </div>
            <p className="text-2xl font-bold">{productsData.metrics.totalRevenue}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="text-[var(--primary-color)]" size={20} />
              <span className="text-sm text-gray-400">Total de vendas</span>
            </div>
            <p className="text-2xl font-bold">{productsData.metrics.totalSales}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-pink-500" size={20} />
              <span className="text-sm text-gray-400">Taxa de conversão</span>
            </div>
            <p className="text-2xl font-bold">{productsData.metrics.conversionRate}</p>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Produto</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Preço</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Vendas</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Receita</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {productsData.products.map((product) => (
                  <tr key={product.id} className={`border-b ${isDarkMode ? 'border-[#1E1E2E] hover:bg-[#1E1E2E]/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={`${import.meta.env.VITE_API_BASE_URL}${product.image}`} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium">{product.price}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm px-2 py-1 rounded-full ${statusColors[product.status as keyof typeof statusColors]}`}>
                        {product.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{product.sales}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{product.revenue}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button  onClick={() => handleView(product.id)} className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}>
                          <Eye size={18} />
                        </button>
                        <button  onClick={() => handleEdit(product.id)} className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}>
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className={`p-2 text-gray-400 hover:text-white ${isDarkMode ? 'hover:bg-[#2A2A3A]' : 'hover:bg-gray-100'} rounded-lg transition-colors`}>
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
      </div>
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Visualizar Produto</h2>
            <p><strong>Nome:</strong> {selectedProduct.name}</p>
            <p><strong>Preço:</strong> R$ {selectedProduct.price}</p>
            <p><strong>Tipo:</strong> {selectedProduct.type}</p>
            {selectedProduct.image && (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${selectedProduct.image}`}
                alt={selectedProduct.name}
                className="w-32 h-32 object-cover rounded mt-4"
              />
            )}
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      {editProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className={`w-full max-w-md p-6 rounded-xl border ${
            isDarkMode
              ? 'bg-[var(--card-background)] border-white/5'
              : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-xl font-bold mb-6 text-white">Editar Produto</h2>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-400">Nome</span>
                <input
                  type="text"
                  className={`mt-1 block w-full rounded-lg border-2 text-sm ${
                    isDarkMode
                      ? 'bg-[var(--card-background)] border-white/5'
                      : 'bg-gray-50 border-gray-200'
                  } focus:border-[var(--primary-color)] focus:ring-0`}
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-400">Preço</span>
                <input
                  type="number"
                  step="0.01"
                  className={`mt-1 block w-full rounded-lg border-2 text-sm ${
                    isDarkMode
                      ? 'bg-[var(--card-background)] border-white/5'
                      : 'bg-gray-50 border-gray-200'
                  } focus:border-[var(--primary-color)] focus:ring-0`}
                  value={editForm.price}
                  onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-400">Tipo</span>
                <select
                  className={`mt-1 block w-full rounded-lg border-2 text-sm ${
                    isDarkMode
                      ? 'bg-[var(--card-background)] border-white/5'
                      : 'bg-gray-50 border-gray-200'
                  } focus:border-[var(--primary-color)] focus:ring-0`}
                  value={editForm.type}
                  onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                >
                  <option value="digital">Digital</option>
                  <option value="physical">Físico</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setEditProduct(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white text-sm font-medium hover:bg-[var(--primary-color)]/90"
                onClick={async () => {
                  try {
                    await checkoutService.updateProductById(editProduct.id, {
                      ...editForm,
                      price: parseFloat(editForm.price),
                    });
                    toast.success('Produto atualizado!');
                    setEditProduct(null);
                    fetchProducts();
                  } catch (err) {
                    toast.error('Erro ao atualizar produto');
                  }
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  );
}
