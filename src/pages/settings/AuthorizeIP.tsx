import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PageHeader from '../../components/PageHeader';
import { toast } from 'sonner';
import { settingService } from '../../services/settingsService';

export default function AuthorizeIP() {
  const intl = useIntl();
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
      toast.error(intl.formatMessage({ id: 'settings.ip.loadError' }))
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
      toast.error(intl.formatMessage({ id: 'settings.ip.addError' }))
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
      toast.error(intl.formatMessage({ id: 'settings.ip.removeError' }))
    }
  };

  useEffect(() => {
    fetchIps();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={intl.formatMessage({ id: 'settings.authorizedIps' })}
        description={intl.formatMessage({ id: 'settings.authorizedIpsDesc' })}
      />

      <div className="mt-8 bg-[var(--card-background)] rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium">{intl.formatMessage({ id: 'settings.ip.authorizedAddresses' })}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {intl.formatMessage({ id: 'settings.ip.addOrRemove' })}
            </p>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'settings.ip.inputPlaceholder' })}
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddIp}
              disabled={adding}
              className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {adding ? intl.formatMessage({ id: 'settings.ip.adding' }) : intl.formatMessage({ id: 'settings.ip.add' })}
            </button>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-gray-500">{intl.formatMessage({ id: 'settings.ip.loading' })}</p>
            ) : ips.length === 0 ? (
              <p className="text-sm text-gray-500">{intl.formatMessage({ id: 'settings.ip.none' })}</p>
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
                      {intl.formatMessage({ id: 'settings.ip.remove' })}
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
