import React, { useState, useContext } from 'react';
import { ArrowLeft, CreditCard, BadgeDollarSign, Wallet, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';

const paymentMethods = [
  { id: 'credit_card', name: 'Cartão de Crédito', icon: CreditCard },
  { id: 'pix', name: 'PIX', icon: BadgeDollarSign },
  { id: 'boleto', name: 'Boleto', icon: Wallet },
];

const products = [
  {
    id: 1,
    name: "Consultoria de Marketing",
    price: "R$ 1.500,00",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=64&h=64&fit=crop"
  },
  {
    id: 2,
    name: "InfoBoost",
    price: "R$ 997,00",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=64&h=64&fit=crop"
  }
];

const customers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com"
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com"
  }
];

export default function NewSale() {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState('');
  const [showCustomers, setShowCustomers] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  
  return (
    <>
      <header className={`sticky top-0 z-20 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} px-4 lg:px-8 py-4`}>
        <div className="flex items-center gap-4">
          <Link to="/vendas" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Nova Venda</h1>
            <p className="text-sm text-gray-400">Crie uma nova venda</p>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 space-y-6 border`}>
            <div className="space-y-4">
              {/* Customer Selection */}
              <div className="relative">
                <label className="block">
                  <span className="text-sm font-medium text-gray-400">Cliente</span>
                  <div
                    onClick={() => setShowCustomers(!showCustomers)}
                    className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-[var(--primary-color)] px-3 py-2 cursor-pointer`}
                  >
                    <Search size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {selectedCustomer 
                        ? customers.find(c => c.id === selectedCustomer)?.name
                        : "Selecione um cliente"}
                    </span>
                  </div>
                </label>

                {showCustomers && (
                  <div className={`absolute z-10 mt-1 w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} border shadow-lg`}>
                    {customers.map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() => {
                          setSelectedCustomer(customer.id);
                          setShowCustomers(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-[var(--primary-color)]/10 transition-colors ${
                          selectedCustomer === customer.id ? 'bg-[var(--primary-color)]/10' : ''
                        }`}
                      >
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-400">{customer.email}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Selection */}
              <div className="relative">
                <label className="block">
                  <span className="text-sm font-medium text-gray-400">Produto</span>
                  <div
                    onClick={() => setShowProducts(!showProducts)}
                    className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-[var(--primary-color)] px-3 py-2 cursor-pointer`}
                  >
                    <Search size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {selectedProduct 
                        ? products.find(p => p.id === selectedProduct)?.name
                        : "Selecione um produto"}
                    </span>
                  </div>
                </label>

                {showProducts && (
                  <div className={`absolute z-10 mt-1 w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} border shadow-lg`}>
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setShowProducts(false);
                          setCustomPrice(product.price);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-[var(--primary-color)]/10 transition-colors ${
                          selectedProduct === product.id ? 'bg-[var(--primary-color)]/10' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-400">{product.price}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-400">Valor</span>
                <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus-within:border-[var(--primary-color)] px-3`}>
                  <span className="text-gray-400">R$</span>
                  <input
                    type="text"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                    placeholder="0,00"
                  />
                </div>
              </label>

              <div>
                <span className="text-sm font-medium text-gray-400 block mb-2">Método de pagamento</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`
                        p-4 rounded-lg border-2 flex items-center gap-3
                        ${selectedMethod === method.id 
                          ? 'border-[var(--primary-color)] bg-[var(--primary-light)]' 
                          : isDarkMode 
                            ? 'border-[var(--card-background)] hover:border-[var(--primary-color)]/50'
                            : 'border-gray-200 hover:border-[var(--primary-color)]/50'
                        }
                        transition-colors
                      `}
                    >
                      <method.icon size={20} />
                      <span className="text-sm font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`pt-6 border-t ${isDarkMode ? 'border-[var(--card-background)]' : 'border-gray-200'}`}>
              <button 
                className={`
                  w-full py-2 px-4 rounded-lg font-medium transition-colors
                  ${selectedProduct && selectedCustomer && selectedMethod
                    ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/90'
                    : isDarkMode 
                      ? 'bg-[var(--card-background)] text-gray-400'
                      : 'bg-gray-100 text-gray-400'
                  }
                `}
                disabled={!selectedProduct || !selectedCustomer || !selectedMethod}
              >
                Criar venda
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}