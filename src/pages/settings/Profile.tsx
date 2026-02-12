import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, User, Mail, Phone, Building2, MapPin, KeyRound, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../lib/theme.ts';
import { fees as sharedFees } from '../../config/fees';
import { utilsservice } from '../../services/utilsService';
import InputMask from 'react-input-mask';
export default function Profile() {
    const [depositRate, setDepositRate] = useState<number | null>(null);
    const [rateFixed, setRateFixed] = useState<number | null>(null);
    const [withdrawRate, setWithdrawRate] = useState<number | null>(null);
    const [rateFixedWithdraw, setRateFixedWithdraw] = useState<number | null>(null);
    React.useEffect(() => {
      const fetchDepositRate = async () => {
        try {
          const token = utilsservice.getTokenValido();
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/user/deposit-rate`,
            token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
          );
          setDepositRate(response.data.deposit_rate);
          setRateFixed(response.data.rate_fixed);
          setWithdrawRate(response.data.withdraw_rate);
          setRateFixedWithdraw(response.data.rate_fixed_withdrawal)
        } catch (error) {
          setDepositRate(null);
          setRateFixed(null);
        }
      };
      async function getDataUser(){
        try {
          const token = utilsservice.getTokenValido();
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/dataUser-profile`, 
            token ? {headers: { Authorization: `Bearer ${token}` }} : undefined
          );
          setEmail(response.data.email);
          setPhone(response.data.phone);
          setCep(response.data.cep);
          setDocument(response.data.cpf_cnpj);
          setAddress(response.data.address);
          setCity(response.data.city);
          setState(response.data.state);
        }
        catch(error){
          setEmail('');
          setPhone('');
          setCep('');
          setDocument('');
          setAddress('');
          setCity('');
          setState('');
        }
      }
      getDataUser();
      fetchDepositRate();
    }, []);
  const { isDarkMode } = useContext(ThemeContext);
  const [tab, setTab] = useState<'perfil' | 'senha' | 'taxas' | 'seguranca'>('perfil');
  const [fullName, setFullName] = useState((localStorage.getItem('username') || '').trim() || 'Usuário');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [document, setDocument] = useState('');
  const fees = {
    ...sharedFees,
    card: { ...sharedFees.card, percent: 0, fixed: 0 },
    boleto: { ...sharedFees.boleto, percent: 0, fixed: 0 },
    ticketMax: {
      pix: 0,
      card: 0,
      boleto: 0
    }
  };
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const token = utilsservice.getTokenValido();   
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/update-profile`,
        {
          full_name: fullName,
          name: fullName,
          phone: phone.replace(/\D/g, ''),
          cep: cep.replace(/\D/g, ''),
          address,
          city,
          state
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      localStorage.setItem('username', fullName);
      toast.success(response.data.message || 'Perfil atualizado com sucesso!');
      localStorage.setItem('username', fullName);
    } catch (err) {
      const error = err as any;
      toast.error(error?.response?.data?.error || 'Erro ao atualizar perfil.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = utilsservice.getTokenValido();
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/change-password`,
        {
          password,
          newPassword,
          confirmPassword
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      toast.success(response.data.message || 'Senha alterada com sucesso!');
    } catch (err) {
      const error = err as any;
      toast.error(error?.response?.data?.error || 'Erro ao alterar senha.');
    } finally {
      setLoading(false);
    }
  };


  function formatCpfCnpj(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 11) {
    return digits.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );
  }

  if (digits.length === 14) {
    return digits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  }

  return value;
}

  return (
    <>
      <header className={`sticky top-0 z-20 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} px-4 lg:px-8 py-4`}>
        <div className="flex items-center gap-4">
          <Link to="/configuracoes" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Perfil</h1>
            <p className="text-sm text-gray-400">Gerencie suas informações pessoais</p>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setTab('perfil')}
              className={`px-4 py-2 rounded-lg text-sm border ${tab === 'perfil' ? 'bg-[var(--primary-color)] text-white border-transparent' : isDarkMode ? 'bg-[var(--card-background)]/80 border-white/5 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}
            >
              Perfil
            </button>
            <button
              onClick={() => setTab('senha')}
              className={`px-4 py-2 rounded-lg text-sm border ${tab === 'senha' ? 'bg-[var(--primary-color)] text-white border-transparent' : isDarkMode ? 'bg-[var(--card-background)]/80 border-white/5 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}
            >
              Senha
            </button>
            <button
              onClick={() => setTab('taxas')}
              className={`px-4 py-2 rounded-lg text-sm border ${tab === 'taxas' ? 'bg-[var(--primary-color)] text-white border-transparent' : isDarkMode ? 'bg-[var(--card-background)]/80 border-white/5 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}
            >
              Taxas
            </button>
            <button
              onClick={() => setTab('seguranca')}
              className={`px-4 py-2 rounded-lg text-sm border ${tab === 'seguranca' ? 'bg-[var(--primary-color)] text-white border-transparent' : isDarkMode ? 'bg-[var(--card-background)]/80 border-white/5 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}
            >
              Segurança
            </button>
          </div>

          {tab === 'perfil' && (
            <form onSubmit={handleUpdateProfile} className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 space-y-6 border`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--primary-color)]/15 flex items-center justify-center">
                  <User size={28} className="text-[var(--primary-color)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Dados Pessoais</h2>
                  <p className="text-sm text-gray-400">Suas informações de perfil e contato</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-400">Nome completo</span>
                    <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3`}>
                      <User size={16} className="text-gray-400" />
                      <input type="text" className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm" placeholder="Digite seu nome" value={fullName} onChange={e => setFullName(e.target.value)} required />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-400">Email</span>
                    <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3`}>
                      <Mail size={16} className="text-gray-400" />
                      <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} disabled aria-readonly className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm opacity-60 cursor-not-allowed" placeholder="Digite seu email" defaultValue="" />
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-400">Celular</span>
                    <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3`}>
                      <Phone size={16} className="text-gray-400" />
                       <InputMask mask="(99) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)}>
                        {(inputProps: any) => (
                        <input
                        {...inputProps}
                        type="tel"
                        className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm"
                        placeholder="(00) 00000-0000"
                        required
                          />
                        )}
                        </InputMask>
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-400">CPF/CNPJ</span>
                    <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3`}>
                      <Building2 size={16} className="text-gray-400" />
                      <input type="text" disabled aria-readonly className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm opacity-60 cursor-not-allowed" placeholder="Digite seu CPF ou CNPJ" defaultValue=""  value={formatCpfCnpj(document)}  />
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-400">CEP</span>
                    <InputMask
                    mask="99999-999"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    >
                    {(inputProps: any) => (
                    <input
                    {...inputProps}
                    type="text"
                    className={`mt-1 w-full h-11 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3 text-sm`}
                    placeholder="00000-000"
                    required
                    />)}
                  </InputMask>
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-gray-400">Endereço</span>
                    <div className={`mt-1 flex items-center gap-2 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3`}>
                      <MapPin size={16} className="text-gray-400" />
                      <input type="text" className="block w-full py-2 bg-transparent border-none focus:ring-0 text-sm" placeholder="Rua, número, complemento" value={address} onChange={e => setAddress(e.target.value)} required />
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-400">Cidade</span>
                    <input type="text" className={`mt-1 w-full h-11 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3 text-sm`} placeholder="Cidade" value={city} onChange={e => setCity(e.target.value)} required />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-400">Estado</span>
                    <input type="text" className={`mt-1 w-full h-11 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3 text-sm`} placeholder="UF" value={state} onChange={e => setState(e.target.value)} />
                  </label>
                </div>
              </div>

              <div className={`pt-4 border-t ${isDarkMode ? 'border-[#1E1E2E]' : 'border-gray-200'}`}>
                <div className="flex justify-end gap-2">
                  <button type="button" className={`${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-800'} px-4 py-2 rounded-lg text-sm border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>Cancelar</button>
                  <button type="submit" disabled={loadingProfile} className="px-4 py-2 rounded-lg text-sm bg-[var(--primary-color)] text-white hover:opacity-90">{loadingProfile ? 'Salvando...' : 'Salvar alterações'}</button>
                </div>
              </div>
            </form>
          )}

          {tab === 'senha' && (
            <form onSubmit={handleChangePassword} className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 space-y-6 border`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)]/15 flex items-center justify-center"><KeyRound size={18} className="text-[var(--primary-color)]"/></div>
                <div>
                  <h2 className="text-lg font-semibold">Alterar senha</h2>
                  <p className="text-sm text-gray-400">Atualize sua senha de acesso</p>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-400">Senha atual</span>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`mt-1 w-full h-11 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3 text-sm`} placeholder="Digite sua senha atual" required />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-400">Nova senha</span>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`mt-1 w-full h-11 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3 text-sm`} placeholder="Digite a nova senha" required />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-400">Confirmar nova senha</span>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`mt-1 w-full h-11 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-gray-50 border-gray-200'} border px-3 text-sm`} placeholder="Confirme a nova senha" required />
                  </label>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm bg-[var(--primary-color)] text-white hover:opacity-90">{loading ? 'Salvando...' : 'Salvar nova senha'}</button>
              </div>
            </form>
          )}

          {tab === 'taxas' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Taxas</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* PIX */}
                <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-5 border`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-semibold">Depósito por Pix</div>
                      <p className="text-sm text-gray-400 mt-0.5">É o novo meio de pagamento instantâneo da plataforma.</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10" />
                  </div>
                 <div className="mt-4 text-emerald-400 font-semibold">
                  {Number(depositRate ?? fees.pix.percent).toFixed(2)}% + R${" "}
                  {Number(rateFixed ?? fees.pix.fixed).toFixed(2)}
                  <span className="font-normal text-white/70">/transação</span>
                </div>
                  <div className="text-xs text-gray-400 mt-1">Reserva financeira de {fees.pix.reserve.toFixed(2)}%</div>
                </div>

                 <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-5 border`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-semibold">Saque por Pix</div>
                      <p className="text-sm text-gray-400 mt-0.5">É o novo meio de recebimento instantâneo da plataforma.</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10" />
                  </div>
                 <div className="mt-4 text-emerald-400 font-semibold">
                  {(
                    withdrawRate ?? fees.pix.percent
                  ).toString() && Number(withdrawRate ?? fees.pix.percent).toFixed(2)}% + R${" "}
                  {(
                    rateFixedWithdraw ?? fees.pix.fixed
                  ).toString() && Number(rateFixedWithdraw ?? fees.pix.fixed).toFixed(2)}
                  <span className="font-normal text-white/70">/transação</span>
                </div>
                  <div className="text-xs text-gray-400 mt-1">Reserva financeira de {fees.pix.reserve.toFixed(2)}%</div>
                </div>
                {/* Cartão de Crédito */}
                <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-5 border`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-semibold">Cartão de Crédito</div>
                      <p className="text-sm text-gray-400 mt-0.5">Para ver as taxas por parcela, <a className="underline text-[var(--primary-color)]" href="#">clique aqui</a>.</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10" />
                  </div>
                  <div className="mt-4 text-emerald-400 font-semibold">
                    {fees.card.percent.toFixed(2)}% + R$ {fees.card.fixed.toFixed(2)} <span className="font-normal text-white/70">/transação</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Reserva financeira de {fees.card.reserve.toFixed(2)}% (apenas em antecipações)</div>
                </div>

                {/* Boleto */}
                <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-5 border`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-semibold">Boleto</div>
                      <p className="text-sm text-gray-400 mt-0.5">Boletos emitidos não são cobrados, apenas os pagos. Se você não vender, não paga!</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10" />
                  </div>
                  <div className="mt-4 text-emerald-400 font-semibold">
                    {fees.boleto.percent.toFixed(2)}% + R$ {fees.boleto.fixed.toFixed(2)} <span className="font-normal text-white/70">/transação</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Reserva financeira de {fees.boleto.reserve.toFixed(2)}%</div>
                </div>


                {/* Ticket máximo */}
                <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-5 border`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-semibold">Ticket máximo</div>
                      <p className="text-sm text-gray-400 mt-0.5">Limite máximo para transações via cartão, Pix e Boleto. Pedidos acima desse limite não serão autorizados.</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10" />
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-white/70">Pix:</div>
                      <div className="text-emerald-400 font-semibold">R$ {fees.ticketMax.pix.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-white/70">Crédito:</div>
                      <div className="text-emerald-400 font-semibold">R$ {fees.ticketMax.card.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-white/70">Boleto:</div>
                      <div className="text-emerald-400 font-semibold">R$ {fees.ticketMax.boleto.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Ticket mínimo */}
                <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-5 border`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-semibold">Ticket mínimo</div>
                      <p className="text-sm text-gray-400 mt-0.5">Limite mínimo para transações via todos os meios de pagamento. Pedidos abaixo deste limite não serão autorizados.</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10" />
                  </div>
                  <div className="mt-4 text-emerald-400 font-semibold">R$ {fees.ticketMin.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          {tab === 'seguranca' && (
            <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)]/15 flex items-center justify-center"><Shield size={18} className="text-[var(--primary-color)]"/></div>
                <h2 className="text-lg font-semibold">Segurança</h2>
              </div>
              <p className="text-sm text-gray-400">Configurações de segurança estarão disponíveis aqui.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}