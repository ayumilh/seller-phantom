import React, { useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import { ThemeContext } from '../lib/theme.ts';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onClose: () => void;
}

export function ModalFirstAccess({ onClose }: Props) {
  const intl = useIntl();
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
      setError(intl.formatMessage({ id: 'modal.firstAccess.invalidCode' }));
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" />
      <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} relative w-full max-w-2xl rounded-2xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} p-0 overflow-hidden`}> 
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
          <h3 className="text-lg font-semibold">{intl.formatMessage({ id: 'modal.firstAccess.title' })}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5"><X size={18}/></button>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <aside className="lg:col-span-1 space-y-3">
            <div className="text-sm text-white/70">
              {intl.formatMessage({ id: 'modal.firstAccess.agree' })}
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)} className="h-4 w-4"/>
              {intl.formatMessage({ id: 'modal.firstAccess.acceptTerms' })}
            </label>
            {!sent ? (
              <button disabled={!accepted} onClick={handleSend} className={`w-full h-10 rounded-lg ${accepted ? 'bg-[var(--primary-color)] text-white' : 'bg-white/10 text-white/60'} `}>{intl.formatMessage({ id: 'modal.firstAccess.sendCode' })}</button>
            ) : (
              <div className="text-xs text-emerald-400">{intl.formatMessage({ id: 'modal.firstAccess.codeSent' })}</div>
            )}
          </aside>
          <main className="lg:col-span-2">
            <div className="text-sm text-white/80 h-48 overflow-y-auto p-3 rounded-lg border border-white/10">
              <p className="mb-2 font-medium">{intl.formatMessage({ id: 'modal.firstAccess.termsSummary' })}</p>
              <p className="mb-2 text-white/70">{intl.formatMessage({ id: 'modal.firstAccess.termsSummaryDesc' })}</p>
              <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
                <li>{intl.formatMessage({ id: 'modal.firstAccess.term1' })}</li>
                <li>{intl.formatMessage({ id: 'modal.firstAccess.term2' })}</li>
                <li>{intl.formatMessage({ id: 'modal.firstAccess.term3' })}</li>
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
                  placeholder={intl.formatMessage({ id: 'modal.firstAccess.codePlaceholder' })}
                  required
                />
                <button type="submit" className="h-11 px-4 rounded-lg bg-[var(--primary-color)] text-white">{intl.formatMessage({ id: 'modal.firstAccess.validate' })}</button>
              </form>
            )}
            {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
          </main>
        </div>
      </div>
    </div>
  );
}
