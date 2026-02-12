import React, { useContext, useState } from 'react';
import { ThemeContext } from '../lib/theme.ts';
import { PageHeader } from '../components/PageHeader';
import { MessageSquare, Send, Paperclip } from 'lucide-react';

const categories = [
  'Pagamentos',
  'Saques',
  'Integrações',
  'Conta',
  'Outros'
];

export default function Support() {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  return (
    <>
      <PageHeader
        title="Suporte"
        description="Entre em contato com nossa equipe"
      />

      <div className="p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 space-y-6 border`}>
            <div className="flex items-center gap-4 pb-6 border-b border-gray-700">
              <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-[var(--primary-color)]" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Novo Ticket</h2>
                <p className="text-sm text-gray-400">Envie sua dúvida ou solicitação</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                  placeholder="Digite o assunto do seu ticket"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className={`w-full rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border-2 focus:border-[var(--primary-color)] focus:ring-0 text-sm`}
                  placeholder="Descreva sua dúvida ou solicitação..."
                />
              </div>

              <div className="flex items-center gap-4">
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] hover:bg-[#2A2A3A]' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                  <Paperclip size={20} className="text-gray-400" />
                  <span className="text-sm">Anexar arquivo</span>
                </button>
                <span className="text-xs text-gray-400">Máximo: 10MB</span>
              </div>
            </div>

            <div className={`pt-6 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
              <button className="w-full bg-[var(--primary-color)] text-white h-12 rounded-lg hover:bg-[var(--primary-color)]/90 transition-colors flex items-center justify-center gap-2">
                <Send size={20} />
                Enviar ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}