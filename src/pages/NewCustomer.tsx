import React, { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../lib/theme.ts';

export default function NewCustomer() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <>
      <header className={`sticky top-0 z-20 ${isDarkMode ? 'bg-[#0B0B14]' : 'bg-gray-50'} px-4 lg:px-8 py-4`}>
        <div className="flex items-center gap-4">
          <Link to="/clientes" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Novo Cliente</h1>
            <p className="text-sm text-gray-400">Adicione um novo cliente</p>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${isDarkMode ? 'bg-[#12121E] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 space-y-6 border`}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-400">Nome completo</span>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                    placeholder="Digite o nome completo"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-400">Email</span>
                  <input
                    type="email"
                    className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                    placeholder="Digite o email"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-400">CPF/CNPJ</span>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                    placeholder="Digite o CPF ou CNPJ"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-400">Telefone</span>
                  <input
                    type="tel"
                    className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                    placeholder="Digite o telefone"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-400">Endereço</span>
                <input
                  type="text"
                  className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                  placeholder="Digite o endereço completo"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-400">Status</span>
                <select
                  className={`mt-1 block w-full rounded-lg ${isDarkMode ? 'bg-[#1E1E2E] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-purple-500 focus:ring-0 text-sm`}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </label>
            </div>

            <div className={`pt-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
              <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors">
                Criar cliente
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}