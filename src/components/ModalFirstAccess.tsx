aimport React, { useState, useContext } from 'react';
import { ThemeContext } from '../lib/theme.ts';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onClose: () => void;
}

export function ModalFirstAccess({ onClose }: Props) {
  const { isDarkMode } = useContext(ThemeContext);
  const [accepted, setAccepted] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (!accepted) return;
    setSent(true);
    setError('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length === 6) {
      onClose();
      navigate('/kyc');
    } else {
      setError('Código inválido. Use 6 dígitos.');
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" />
      <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} relative w-full max-w-2xl rounded-2xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} p-0 overflow-hidden`}> 
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
          <h3 className="text-lg font-semibold">Termos, Privacidade e Verificação</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5"><X size={18}/></button>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <aside className="lg:col-span-1 space-y-3">
            <div className="text-sm text-white/70">
              Ao continuar, você concorda com nossos Termos e Condições e Política de Privacidade. Para sua segurança, enviaremos um código de 6 dígitos para seu email.
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)} className="h-4 w-4"/>
              Li e aceito os Termos & Condições e a Política de Privacidade.
            </label>
            {!sent ? (
              <button disabled={!accepted} onClick={handleSend} className={`w-full h-10 rounded-lg ${accepted ? 'bg-[var(--primary-color)] text-white' : 'bg-white/10 text-white/60'} `}>Enviar código</button>
            ) : (
              <div className="text-xs text-emerald-400">Código enviado para seu email.</div>
            )}
          </aside>
          <main className="lg:col-span-2">
            <div className="text-sm text-white/80 h-48 overflow-y-auto p-3 rounded-lg border border-white/10">
              <p className="mb-2 font-medium">Termos e Condições (resumo)</p>
              <p className="mb-2 text-white/70">Este é um resumo visual dos termos para fins de onboarding. O conteúdo completo ficará disponível em link dedicado.</p>
              <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
                <li>Você concorda em fornecer informações verdadeiras.</li>
                <li>Você declara estar ciente das políticas de uso e privacidade.</li>
                <li>Você aceita receber comunicações transacionais por email.</li>
              </ul>
            </div>
            {sent && (
              <form onSubmit={handleVerify} className="mt-4 flex items-center gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\\d{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className={`flex-1 h-11 rounded-lg border ${isDarkMode ? 'bg-[var(--card-background)] border-white/10' : 'bg-white border-gray-200'} px-3`}
                  placeholder="Digite o código (6 dígitos)"
                  required
                />
                <button type="submit" className="h-11 px-4 rounded-lg bg-[var(--primary-color)] text-white">Validar</button>
              </form>
            )}
            {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
          </main>
        </div>
      </div>
    </div>
  );
}
