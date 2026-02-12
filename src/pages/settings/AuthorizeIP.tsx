import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { toast } from 'sonner';
import { settingService } from '../../services/settingsService';

export default function AuthorizeIP() {
  const [ips, setIps] = useState<any[]>([]);
  const [ipInput, setIpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchIps = async () => {
    setLoading(true);
    try {
      const data = await settingService.getAuthorizedIps();
      setIps(data);
    } catch (error) {
      console.error('Erro ao carregar IPs autorizados:', error);
      toast.error("Tivemos um problema ao carregar seu dados de IP. Espere um pouco!")
    } finally {
      setLoading(false);
    }
  };

  const handleAddIp = async () => {
    if (!ipInput.trim()) return;

    setAdding(true);
    try {
      await settingService.addAuthorizedIp(ipInput.trim());
      setIpInput('');
      fetchIps();
    } catch (error) {
      console.error('Erro ao adicionar IP:', error);
      toast.error("Erro ao adicionar IP. Favor entrar em contato com o administrador do sistema!")
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteIp = async (id: number) => {
    try {
      await settingService.deleteAuthorizedIp(id);
      setIps((prev) => prev.filter((ip) => ip.id !== id));
    } catch (error) {
      console.error('Erro ao remover IP:', error);
      toast.error("Erro ao remover o IP. Favor entrar em contato com o administrador do sistema!")
    }
  };

  useEffect(() => {
    fetchIps();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="IPs Autorizados"
        description="Gerencie IPs autorizados para saque via API"
      />

      <div className="mt-8 bg-[var(--card-background)] rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium">Endereços IP autorizados</h3>
            <p className="text-sm text-gray-500 mt-1">
              Adicionar ou remover endereços IP que podem sacar via API
            </p>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Digite o IP (ex: 192.168.1.1)"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddIp}
              disabled={adding}
              className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {adding ? 'Adicionando...' : 'Adicionar IP'}
            </button>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-gray-500">Carregando IPs...</p>
            ) : ips.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum endereço IP autorizado ainda</p>
            ) : (
              <ul className="space-y-2">
                {ips.map((ip) => (
                  <li
                    key={ip.id}
                    className="flex justify-between items-center bg-white dark:bg-[var(--background-color)] px-4 py-2 rounded-md"
                  >
                    <span>{ip.authorized_ip}</span>
                    <button
                      onClick={() => handleDeleteIp(ip.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
