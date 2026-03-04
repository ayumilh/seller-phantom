import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { ArrowRight, Rocket, Zap, Shield, Wallet, Search } from 'lucide-react';
import { useState } from 'react';
import { Loading } from '../../components/Loading';
import { updateThemeVariables } from '../../lib/theme';

const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://api.phantompay.com.br';

const authExample = `curl -X POST ${import.meta.env.VITE_API_BASE_URL || 'https://api. dominio do gateway'}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "seu_cliente_id",
    "client_secret": "seu_cliente_secreto"
  }'`;

const depositExample = `curl -X POST ${apiBase}/api/payments/deposit \\
  -H "Authorization: Bearer seu_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.00,
    "external_id": "id_unico_12345",
    "clientCallbackUrl": "https://seuservidor.com/callback",
    "payer": {
      "name": "João da Silva",
      "email": "joao@example.com",
      "document": "12345678901"
    }
  }'`;

const withdrawExample = `curl -X POST ${apiBase}/api/withdrawals/withdraw \\
  -H "Authorization: Bearer seu_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 50.00,
    "external_id": "external-12345",
    "pix_key": "exemplo@pix.com",
    "key_type": "EMAIL",
    "description": "Saque referente ao pedido #123",
    "clientCallbackUrl": "https://seuservidor.com/callback"
  }'`;

/** NOVO: consulta de status por transaction_id (GET) */
const statusExample = `curl -X GET ${apiBase}/api/transactions/getStatusTransac/TRANSACTION_ID_AQUI \\
  -H "Authorization: Bearer seu_token"`;

const statusExampleResponse = `{
  "status": "PENDING" // Possíveis: PENDING | COMPLETED | FAILED | RETIDO
}`;

/** NOVO: consulta de saldo (GET) */
const balanceExample = `curl -X GET ${apiBase}/api/balance/getBalance \\
  -H "Authorization: Bearer seu_token"`;

const balanceExampleResponse = `{
  "balance":"334.80"
}`;

export default function Introduction() {
  const intl = useIntl();
  const [loadingInit, setLoadingInit] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  // Playground state
  const [playBaseUrl, setPlayBaseUrl] = useState<string>(apiBase);
  const [playToken, setPlayToken] = useState<string>('');
  const [playPath, setPlayPath] = useState<string>('/api/balance/getBalance');
  const [playMethod, setPlayMethod] = useState<'GET'|'POST'>('GET');
  const [playBody, setPlayBody] = useState<string>('{}');
  const [playLoading, setPlayLoading] = useState<boolean>(false);
  const [playResp, setPlayResp] = useState<string>('');
  // Hash pagination state
  const [activeSection, setActiveSection] = useState<string>(() => window.location.hash || '#top');
  // Mostrar/ocultar playground (fechado por padrão)
  const [showPlayground, setShowPlayground] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    updateThemeVariables();
  }, []);
  useEffect(() => {
    Prism.highlightAll();
    const timer = setTimeout(() => { setLoadingInit(false); }, 1000);
    return () => { clearTimeout(timer); };
  }, []);

  // Listen hash changes and preset playground per section
  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash || '#top';
      setActiveSection(h);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Presets by section
  useEffect(() => {
    // rolar para o topo ao trocar de seção
    try { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); } catch { window.scrollTo(0, 0); }

    if (activeSection === '#autenticacao') {
      setPlayMethod('POST');
      setPlayPath('/api/auth/login');
      setPlayBody(`{
  "client_id": "seu_cliente_id",
  "client_secret": "seu_cliente_secreto"
}`);
    } else if (activeSection === '#deposito') {
      setPlayMethod('POST');
      setPlayPath('/api/payments/deposit');
      setPlayBody(`{
  "amount": 100.00,
  "external_id": "id_unico_12345",
  "clientCallbackUrl": "https://seuservidor.com/callback",
  "payer": {
    "name": "João da Silva",
    "email": "joao@example.com",
    "document": "12345678901"
  }
}`);
    } else if (activeSection === '#saque') {
      setPlayMethod('POST');
      setPlayPath('/api/withdrawals/withdraw');
      setPlayBody(`{
  "amount": 50.00,
  "external_id": "external-12345",
  "pix_key": "exemplo@pix.com",
  "key_type": "EMAIL",
  "description": "Saque referente ao pedido #123",
  "clientCallbackUrl": "https://seuservidor.com/callback"
}`);
    } else if (activeSection === '#status-transacao') {
      setPlayMethod('GET');
      setPlayPath('/api/transactions/getStatusTransac/TRANSACTION_ID_AQUI');
      setPlayBody('{}');
    } else if (activeSection === '#saldo-conta') {
      setPlayMethod('GET');
      setPlayPath('/api/balance/getBalance');
      setPlayBody('{}');
    }
  }, [activeSection]);

  // (tema removido do header local; layout usa tema global)

  if (loadingInit) {
    return (<Loading />);
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-[var(--light-background-color)]'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Main Content */}
      <main className="w-full py-8">
        {/* Botão fixo para abrir/fechar o Playground (desktop) */}
        <button
          onClick={() => setShowPlayground(v => !v)}
          className="hidden lg:flex fixed right-6 top-20 z-40 h-9 px-3 rounded-lg bg-[var(--primary-color)] text-white text-sm items-center gap-2 shadow hover:opacity-90"
          aria-controls="docs-playground"
          aria-expanded={showPlayground}
        >
          {showPlayground ? intl.formatMessage({ id: 'docs.playground.close' }) : intl.formatMessage({ id: 'docs.playground.quickTest' })}
        </button>

        {/* Painel direito fixo (desktop) */}
        {showPlayground && (
        <aside id="docs-playground" className="hidden lg:block fixed right-6 top-24 w-[22rem] z-40">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} border ${isDarkMode ? 'border-white/5' : 'border-gray-200'} rounded-2xl p-4 lg:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{intl.formatMessage({ id: 'docs.nav.apiPlayground' })}</h2>
              <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10">{intl.formatMessage({ id: 'docs.playground.quickTest' })}</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs text-white/60 mb-1">{intl.formatMessage({ id: 'docs.playground.baseUrl' })}</label>
                <input value={playBaseUrl} onChange={e=>setPlayBaseUrl(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">{intl.formatMessage({ id: 'docs.playground.bearerToken' })}</label>
                <input value={playToken} onChange={e=>setPlayToken(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none" placeholder={intl.formatMessage({ id: 'docs.playground.tokenOptional' })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-white/60 mb-1">{intl.formatMessage({ id: 'docs.playground.method' })}</label>
                  <select value={playMethod} onChange={e=>setPlayMethod(e.target.value as any)} className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10">
                    <option>GET</option>
                    <option>POST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">{intl.formatMessage({ id: 'docs.playground.preset' })}</label>
                  <select onChange={(e)=>{
                    const p = e.target.value;
                    if(p==='auth'){
                      setPlayMethod('POST');
                      setPlayPath('/api/auth/login');
                      setPlayBody('{\n  "client_id": "seu_cliente_id",\n  "client_secret": "seu_cliente_secreto"\n}');
                    } else if(p==='deposit'){
                      setPlayMethod('POST');
                      setPlayPath('/api/payments/deposit');
                      setPlayBody('{\n  "amount": 100.00,\n  "external_id": "id_unico_12345",\n  "clientCallbackUrl": "https://seuservidor.com/callback",\n  "payer": {\n    "name": "João da Silva",\n    "email": "joao@example.com",\n    "document": "12345678901"\n  }\n}');
                    } else if(p==='withdraw'){
                      setPlayMethod('POST');
                      setPlayPath('/api/withdrawals/withdraw');
                      setPlayBody('{\n  "amount": 50.00,\n  "external_id": "external-12345",\n  "pix_key": "exemplo@pix.com",\n  "key_type": "EMAIL",\n  "description": "Saque referente ao pedido #123",\n  "clientCallbackUrl": "https://seuservidor.com/callback"\n}');
                    } else if(p==='status'){
                      setPlayMethod('GET');
                      setPlayPath('/api/transactions/getStatusTransac/TRANSACTION_ID_AQUI');
                      setPlayBody('{}');
                    } else if(p==='balance'){
                      setPlayMethod('GET');
                      setPlayPath('/api/balance/getBalance');
                      setPlayBody('{}');
                    }
                  }} className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10">
                    <option value="">{intl.formatMessage({ id: 'docs.playground.select' })}</option>
                    <option value="auth">{intl.formatMessage({ id: 'docs.nav.auth' })}</option>
                    <option value="deposit">{intl.formatMessage({ id: 'docs.nav.deposit' })}</option>
                    <option value="withdraw">{intl.formatMessage({ id: 'docs.nav.withdraw' })}</option>
                    <option value="status">{intl.formatMessage({ id: 'docs.nav.statusTrans' })}</option>
                    <option value="balance">{intl.formatMessage({ id: 'docs.nav.balance' })}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">{intl.formatMessage({ id: 'docs.playground.path' })}</label>
                <input value={playPath} onChange={e=>setPlayPath(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none" placeholder={intl.formatMessage({ id: 'docs.playground.pathPlaceholder' })} />
              </div>
            </div>
            {playMethod === 'POST' && (
              <div className="mt-3">
                <label className="block text-xs text-white/60 mb-1">{intl.formatMessage({ id: 'docs.playground.bodyJson' })}</label>
                <textarea value={playBody} onChange={e=>setPlayBody(e.target.value)} rows={6} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none font-mono text-sm" />
              </div>
            )}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={async ()=>{
                  try{
                    setPlayLoading(true);
                    setPlayResp('');
                    const url = (playBaseUrl?.replace(/\/$/, '') || '') + playPath;
                    const headers: any = { 'Content-Type': 'application/json' };
                    if (playToken) headers['Authorization'] = `Bearer ${playToken}`;
                    const res = await fetch(url, {
                      method: playMethod,
                      headers,
                      body: playMethod==='POST' ? playBody : undefined
                    });
                    const text = await res.text();
                    setPlayResp(text);
                  } catch(err:any){
                    setPlayResp(String(err?.message || err));
                  } finally{
                    setPlayLoading(false);
                  }
                }}
                className="h-10 px-4 rounded-lg bg-[var(--primary-color)] text-white hover:opacity-90 active:scale-95 transition"
                disabled={playLoading}
              >
                {playLoading ? intl.formatMessage({ id: 'docs.playground.testing' }) : intl.formatMessage({ id: 'docs.playground.testRequest' })}
              </button>
              <button onClick={()=>setPlayResp('')} className="h-10 px-4 rounded-lg bg-white/5 text-white hover:bg-white/10">{intl.formatMessage({ id: 'docs.playground.clear' })}</button>
            </div>
            {playResp && (
              <div className="mt-3">
                <label className="block text-xs text-white/60 mb-1">{intl.formatMessage({ id: 'docs.playground.response' })}</label>
                <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto`}>
                  <code className="language-json">{playResp}</code>
                </pre>
              </div>
            )}
          </div>
        </aside>
        )}

        <div id="top" className="w-full lg:w-[900px] pl-6 lg:pl-8">
          <div className="space-y-6">
            <div hidden={activeSection !== '#top'}>
              <h1 className="text-4xl font-bold mb-4">{intl.formatMessage({ id: 'docs.intro.title' })}</h1>
              <p className="text-xl text-gray-400">
                {intl.formatMessage({ id: 'docs.intro.welcome' })}
              </p>
            </div>

            <div id="url-base" hidden={activeSection !== '#url-base'} className="p-4 bg-[var(--primary-light)] border border-[var(--primary-color)]/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[var(--primary-color)]" />
                <span className="text-sm font-medium text-[var(--primary-color)]">{intl.formatMessage({ id: 'docs.nav.urlBase' })}</span>
              </div>
              <code className="text-[var(--primary-color)] font-mono">
                {apiBase}
              </code>
            </div>

            {/* Introdução: visão geral (texto) */}
            {activeSection === '#top' && (
              <div className="space-y-4">
                <p className="text-gray-400">
                  {intl.formatMessage({ id: 'docs.intro.overview' })}
                </p>
                <ul className="list-disc pl-6 text-gray-400">
                  <li><a className="text-[var(--primary-color)]" href="#autenticacao">{intl.formatMessage({ id: 'docs.nav.auth' })}</a>: {intl.formatMessage({ id: 'docs.intro.authDesc' })}</li>
                  <li><a className="text-[var(--primary-color)]" href="#deposito">{intl.formatMessage({ id: 'docs.nav.deposit' })}</a>: {intl.formatMessage({ id: 'docs.intro.depositDesc' })}</li>
                  <li><a className="text-[var(--primary-color)]" href="#saque">{intl.formatMessage({ id: 'docs.nav.withdraw' })}</a>: {intl.formatMessage({ id: 'docs.intro.withdrawDesc' })}</li>
                  <li><a className="text-[var(--primary-color)]" href="#status-transacao">{intl.formatMessage({ id: 'docs.nav.statusTrans' })}</a>: {intl.formatMessage({ id: 'docs.intro.statusDesc' })}</li>
                  <li><a className="text-[var(--primary-color)]" href="#saldo-conta">{intl.formatMessage({ id: 'docs.nav.balance' })}</a>: {intl.formatMessage({ id: 'docs.intro.balanceDesc' })}</li>
                </ul>
              </div>
            )}

            {/* AUTENTICAÇÃO */}
            <div id="autenticacao" hidden={activeSection !== '#autenticacao'} className="space-y-6">
              <h2 className="text-2xl font-semibold">{intl.formatMessage({ id: 'docs.auth.title' })}</h2>
              <p className="text-gray-400">
                {intl.formatMessage({ id: 'docs.auth.desc' })}
              </p>

              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'} overflow-hidden`}>
                <div className={`p-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded">POST</span>
                    <code className="text-sm">/api/auth/login</code>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded">{intl.formatMessage({ id: 'docs.common.noAuthRequired' })}</span>
                </div>
                <div className="p-4">
                  <pre className="!bg-transparent">
                    <code className="language-bash">{authExample}</code>
                  </pre>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">Parâmetros da Requisição</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.field' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.type' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.required' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.description' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">client_id</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">ID único do cliente fornecido pelo sistema</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-sm font-mono">client_secret</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">Chave secreta do cliente fornecida pelo sistema</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resposta de Sucesso */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">{intl.formatMessage({ id: 'docs.common.successResponse' })}</h4>
                <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto mb-4`}>
                  <code className="language-json">{`{
  "message": "Authentication successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "name": "João Silva",
    "email": "joao@email.com",
    "client_id": "your_client_id_here"
  }
}`}</code>
                </pre>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.field' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.type' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.description' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">message</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">Mensagem de confirmação do login</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">token</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">Token JWT válido por 1 hora para autenticação</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">user.id</td>
                        <td className="p-3 text-sm">number</td>
                        <td className="p-3 text-sm text-gray-400">ID único do usuário no sistema</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">user.name</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">Nome completo do usuário</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">user.email</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">E-mail do usuário</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-sm font-mono">user.client_id</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">Client ID do usuário (confirmação)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Possíveis Erros */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">{intl.formatMessage({ id: 'docs.common.possibleErrors' })}</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">400 - Bad Request</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "client_id and client_secret are required."
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">
                      <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Campos obrigatórios ausentes (client_id ou client_secret não fornecidos)
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">401 - Unauthorized</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "Invalid client_id or client_secret."
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">
                      <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Credenciais inválidas - client_id ou client_secret incorretos ou não existem no sistema
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">403 - Forbidden</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "User account is banned."
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">
                      <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Conta do usuário foi banida do sistema
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">403 - Forbidden</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "API keys (client_id or client_secret) are not configured for this user."
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">
                      <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Usuário existe mas não possui credenciais de API configuradas
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">500 - Internal Server Error</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "Detailed error message"
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">
                      <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Erro interno do servidor (falha de banco de dados, etc.)
                    </p>
                  </div>
                </div>
              </div>

              {/* Como Usar o Token */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">Como Usar o Token</h4>
                <p className="text-gray-400 mb-4">
                  Após obter o token de autenticação, inclua-o no cabeçalho Authorization das próximas requisições:
                </p>
                <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto`}>
                  <code>{`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</code>
                </pre>
              </div>

              {/* Comportamentos Importantes */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">{intl.formatMessage({ id: 'docs.common.importantBehaviors' })}</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Validade do Token:</strong> 1 hora - É necessário fazer login novamente após a expiração
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Validação imediata:</strong> Credenciais são verificadas em tempo real no banco de dados
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Status de conta:</strong> O sistema verifica automaticamente se a conta está ativa e não banida
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Escopo completo:</strong> O token permite acesso a todas as rotas protegidas da API
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DEPÓSITO */}
            <div id="deposito" hidden={activeSection !== '#deposito'} className="space-y-6">
              <h2 className="text-2xl font-semibold">{intl.formatMessage({ id: 'docs.deposit.title' })}</h2>
              <p className="text-gray-400">
                Este endpoint cria um depósito e gera um QR Code PIX para efetuar o pagamento. 
                O sistema garante idempotência através do <code className="font-mono text-sm">external_id</code> e envia callbacks automáticos 
                sobre mudanças de status da transação.
              </p>

              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'} overflow-hidden`}>
                <div className={`p-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded">POST</span>
                    <code className="text-sm">/api/payments/deposit</code>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded">{intl.formatMessage({ id: 'docs.common.authRequired' })}</span>
                </div>
                <div className="p-4">
                  <pre className="!bg-transparent">
                    <code className="language-bash">{depositExample}</code>
                  </pre>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">Parâmetros da Requisição</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.field' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.type' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.required' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.description' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">amount</td>
                        <td className="p-3 text-sm">number</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">Valor do depósito</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">external_id</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">ID único da transação externa para controle idempotente</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">clientCallbackUrl</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">URL para receber notificações de status do depósito</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">payer.name</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">Nome completo do pagador</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">payer.document</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">CPF/CNPJ do pagador</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">payer.email</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">E-mail do pagador</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-sm font-mono">payer.phone</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-red-500">❌</span></td>
                        <td className="p-3 text-sm text-gray-400">Telefone do pagador (opcional)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resposta de Sucesso */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">{intl.formatMessage({ id: 'docs.common.successResponse201' })}</h4>
                <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto mb-4`}>
                  <code className="language-json">{`{
  "message": "Deposit created successfully.",
  "qrCodeResponse": {
    "transactionId": "abc123def456",
    "status": "PENDING",
    "qrcode": "00020126580014BR.GOV.BCB.PIX...",
    "amount": 100.50
  }
}`}</code>
                </pre>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.field' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.type' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.description' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">message</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">Mensagem de confirmação</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">qrCodeResponse.transactionId</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">ID único da transação no gateway</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">qrCodeResponse.status</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">Status inicial do depósito (sempre "PENDING")</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">qrCodeResponse.qrcode</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">Código PIX para pagamento</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-sm font-mono">qrCodeResponse.amount</td>
                        <td className="p-3 text-sm">number</td>
                        <td className="p-3 text-sm text-gray-400">Valor do depósito confirmado</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Possíveis Erros */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">{intl.formatMessage({ id: 'docs.common.possibleErrors' })}</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">400 - Bad Request</h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                          "Erro ao processar pagamento. Você deve preencher os campos obrigatórios ausentes"
                        </code>
                        <p className="text-gray-400 mt-1">
                          <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Campos obrigatórios ausentes (amount, external_id, clientCallbackUrl, payer)
                        </p>
                      </div>
                      <div>
                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                          "Configuração do gateway não suportada"
                        </code>
                        <p className="text-gray-400 mt-1">
                          <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Gateway do usuário não é suportado pelo sistema
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">401 - Unauthorized</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "Access token is missing or invalid."
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">
                      <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Token de autenticação ausente ou malformado
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">403 - Forbidden</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "Invalid token."
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">
                      <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Token de autenticação expirado ou inválido
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">404 - Not Found</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "Usuario não encontrado"
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">
                      <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Usuário autenticado não existe na base de dados
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">500 - Internal Server Error</h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                          "Gateway padrão não configurado"
                        </code>
                        <p className="text-gray-400 mt-1">
                          <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Gateway não está configurado no sistema
                        </p>
                      </div>
                      <div>
                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                          "Não foi possível gerar o Transaction ID a partir do QR Code. Tente novamente."
                        </code>
                        <p className="text-gray-400 mt-1">
                          <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Falha na comunicação com o gateway de pagamento ou resposta inválida
                        </p>
                      </div>
                      <div>
                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                          "Erro inesperado. Contate o suporte."
                        </code>
                        <p className="text-gray-400 mt-1">
                          <strong>{intl.formatMessage({ id: 'docs.common.cause' })}:</strong> Erro interno do servidor (falha de banco de dados, comunicação com gateway, etc.)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comportamentos Importantes */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">{intl.formatMessage({ id: 'docs.common.importantBehaviors' })}</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Idempotência:</strong> O <code className="font-mono">external_id</code> garante que a mesma transação não seja criada duas vezes
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Timeout padrão:</strong> QR Codes têm validade de 30 minutos (1800 segundos)
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Callback assíncrono:</strong> Falhas no envio do callback inicial não impedem a criação do depósito
                    </div>
                  </div>
                </div>
              </div>

              {/* Callbacks Automáticos */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">Callbacks Automáticos</h4>
                <p className="text-gray-400 mb-4">Após a criação do depósito, o sistema:</p>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">1.</span>
                    <span>Envia callback inicial para <code className="font-mono">clientCallbackUrl</code> com status "PENDING"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">2.</span>
                    <span>Monitora o pagamento através do gateway configurado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">3.</span>
                    <span>Envia atualizações de status conforme o pagamento é processado</span>
                  </div>
                </div>
                
                <h5 className="font-semibold mb-2">Formato do Callback:</h5>
                <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-3 rounded-lg overflow-x-auto`}>
                  <code className="language-json">{`{
  "transaction_id": "abc123def456",
  "status": "PENDING",
  "amount": 100.50,
  "type": "Deposit"
}`}</code>
                </pre>
              </div>
            </div>

            {/* SAQUE */}
            <div id="saque" hidden={activeSection !== '#saque'} className="space-y-6">
              <h2 className="text-2xl font-semibold">{intl.formatMessage({ id: 'docs.withdraw.title' })}</h2>
              <p className="text-gray-400">
                Este endpoint permite solicitação de saques através de chaves PIX. 
                O sistema realiza verificações automáticas de saldo e autenticação, 
                garantindo idempotência através do <code className="font-mono text-sm">external_id</code>.
              </p>

              {/* Requisito de IP */}
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-orange-500/20 bg-orange-500/5' : 'border-orange-200 bg-orange-50'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Requisito de IP Autorizado</h5>
                    <p className="text-sm text-orange-600 dark:text-orange-300 mb-3">
                      Para utilizar a API de saque, é <strong>obrigatório</strong> cadastrar o IP do seu servidor na plataforma.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded font-mono">
                        📋 Configurações → IPs Autorizados
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'} overflow-hidden`}>
                <div className={`p-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded">POST</span>
                    <code className="text-sm">/api/withdrawals/withdraw</code>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded">{intl.formatMessage({ id: 'docs.common.authRequired' })}</span>
                </div>
                <div className="p-4">
                  <pre className="!bg-transparent">
                    <code className="language-bash">{withdrawExample}</code>
                  </pre>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">Parâmetros da Requisição</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.field' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.type' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.required' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.description' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">amount</td>
                        <td className="p-3 text-sm">number</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">Valor do saque</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">external_id</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">ID único externo para controle idempotente</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">pix_key</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">Chave PIX do destinatário</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">key_type</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">Tipo da chave PIX: CPF, CNPJ, EMAIL, PHONE, RANDOM</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">clientCallbackUrl</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-green-500">✅</span></td>
                        <td className="p-3 text-sm text-gray-400">URL para callbacks de status do saque</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-sm font-mono">description</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm"><span className="text-red-500">❌</span></td>
                        <td className="p-3 text-sm text-gray-400">Descrição da transação (opcional)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tipos de Chave PIX */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">Tipos de Chave PIX Suportados</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <code className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-mono">CPF</code>
                    <div>11 dígitos numéricos</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-mono">CNPJ</code>
                    <div>14 dígitos numéricos</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-mono">EMAIL</code>
                    <div>Endereço de email válido</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-mono">PHONE</code>
                    <div>Formato +5511999999999</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-mono">RANDOM</code>
                    <div>Chave aleatória (UUID)</div>
                  </div>
                </div>
              </div>

              {/* Resposta de Sucesso */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">{intl.formatMessage({ id: 'docs.common.successResponse' })}</h4>
                <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto mb-4`}>
                  <code className="language-json">{`{
  "message": "Withdrawal processed successfully.",
  "withdrawal": {
    "transaction_id": "abc123def456",
    "status": "COMPLETED",
    "amount": 100.50,
    "fee": 3.25
  }
}`}</code>
                </pre>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.field' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.type' })}</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'docs.common.description' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">message</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">Mensagem de confirmação</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">withdrawal.transaction_id</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">ID único da transação</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">withdrawal.status</td>
                        <td className="p-3 text-sm">string</td>
                        <td className="p-3 text-sm text-gray-400">Status do saque: PENDING, COMPLETED, FAILED</td>
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                        <td className="p-3 text-sm font-mono">withdrawal.amount</td>
                        <td className="p-3 text-sm">number</td>
                        <td className="p-3 text-sm text-gray-400">Valor do saque solicitado</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-sm font-mono">withdrawal.fee</td>
                        <td className="p-3 text-sm">number</td>
                        <td className="p-3 text-sm text-gray-400">Taxa cobrada</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status dos Saques */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">Status dos Saques</h4>
                <p className="text-gray-400 mb-6">
                  Durante o processamento do saque, a transação passa por diferentes status que são comunicados via callbacks:
                </p>
                
                <div className="grid gap-4">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-yellow-200 bg-yellow-50'} transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span className="px-3 py-1 bg-yellow-500/15 text-yellow-600 rounded-full text-sm font-mono font-semibold">
                        PENDING
                      </span>
                    </div>
                    <div className="ml-6">
                      <div className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Saque criado</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Aguardando processamento no gateway de pagamento
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-green-500/20 bg-green-500/5' : 'border-green-200 bg-green-50'} transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="px-3 py-1 bg-green-500/15 text-green-600 rounded-full text-sm font-mono font-semibold">
                        COMPLETED
                      </span>
                    </div>
                    <div className="ml-6">
                      <div className="font-semibold text-green-700 dark:text-green-400 mb-1">Saque processado</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Saque aprovado e processado com sucesso
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-red-50'} transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="px-3 py-1 bg-red-500/15 text-red-600 rounded-full text-sm font-mono font-semibold">
                        FAILED
                      </span>
                    </div>
                    <div className="ml-6">
                      <div className="font-semibold text-red-700 dark:text-red-400 mb-1">Saque rejeitado</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Saque rejeitado ou falhou no processamento
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/5 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Dica importante</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-300 ml-6">
                    Monitore as mudanças de status através dos callbacks enviados para o <code className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded">clientCallbackUrl</code> configurado.
                  </p>
                </div>
              </div>

              {/* Possíveis Erros */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">{intl.formatMessage({ id: 'docs.common.possibleErrorsShort' })}</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">400 - Bad Request</h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                          "Missing required fields for withdrawal."
                        </code>
                        <p className="text-gray-400 mt-1">Campos obrigatórios ausentes</p>
                      </div>
                      <div>
                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                          "A withdrawal with this external_id already exists."
                        </code>
                        <p className="text-gray-400 mt-1">External ID já utilizado</p>
                      </div>
                      <div>
                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                          "Insufficient funds."
                        </code>
                        <p className="text-gray-400 mt-1">Saldo insuficiente</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">401 - Unauthorized</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "Access token is missing or invalid."
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">Token ausente ou inválido</p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">403 - Forbidden</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "Invalid token."
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">Token expirado ou acesso negado</p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">429 - Too Many Requests</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "Saque em andamento. Tente novamente em instantes."
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">Rate limiting ativo</p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-semibold text-red-500 mb-2">500 - Internal Server Error</h5>
                    <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs">
                      "Internal server error."
                    </code>
                    <p className="text-gray-400 mt-1 text-sm">Erro interno do servidor</p>
                  </div>
                </div>
              </div>

              {/* Comportamentos Importantes */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">{intl.formatMessage({ id: 'docs.common.importantBehaviors' })}</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Idempotência:</strong> O <code className="font-mono">external_id</code> garante que a mesma transação não seja processada duas vezes
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Rate Limiting:</strong> Apenas um saque por usuário pode ser processado por vez
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Validações:</strong> Sistema verifica automaticamente saldo e autenticação
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Callbacks:</strong> Notificações são enviadas para <code className="font-mono">clientCallbackUrl</code> sobre mudanças de status
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS DA TRANSAÇÃO */}
            <div id="status-transacao" hidden={activeSection !== '#status-transacao'} className="space-y-6">
              <h2 className="text-2xl font-semibold">{intl.formatMessage({ id: 'docs.status.title' })}</h2>
              <p className="text-gray-400">
                Consulte o status atual de uma transação de <strong>depósito</strong> informando o <code className="font-mono text-sm">transaction_id</code>.
                Esta rota retorna apenas o status atual da transação em tempo real.
              </p>

              {/* Aviso sobre Depósitos */}
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-blue-500/20 bg-blue-500/5' : 'border-blue-200 bg-blue-50'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Apenas Depósitos</h5>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Esta rota consulta <strong>apenas transações de depósito</strong>. Para consultar status de saques, utilize outras rotas específicas.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'} overflow-hidden`}>
                <div className={`p-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs font-medium rounded">GET</span>
                    <code className="text-sm">/api/transactions/getStatusTransac/:transaction_id</code>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded">{intl.formatMessage({ id: 'docs.common.authRequired' })}</span>
                </div>
                <div className="p-4 space-y-4">
                  <pre className="!bg-transparent">
                    <code className="language-bash">{statusExample}</code>
                  </pre>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Resposta de Sucesso (200)</h4>
                    <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto`}>
                      <code className="language-json">{statusExampleResponse}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Status Possíveis */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">Status Possíveis de Retorno</h4>
                <p className="text-gray-400 mb-6">
                  A rota retorna apenas 3 status principais definidos no modelo Deposit:
                </p>
                
                <div className="grid gap-4">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-yellow-200 bg-yellow-50'} transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span className="px-3 py-1 bg-yellow-500/15 text-yellow-600 rounded-full text-sm font-mono font-semibold">
                        PENDING
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">Default</span>
                    </div>
                    <div className="ml-6">
                      <div className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Transação criada, aguardando processamento</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Quando ocorre:</strong> Status inicial de toda transação (padrão ao criar)
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-green-500/20 bg-green-500/5' : 'border-green-200 bg-green-50'} transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="px-3 py-1 bg-green-500/15 text-green-600 rounded-full text-sm font-mono font-semibold">
                        COMPLETED
                      </span>
                    </div>
                    <div className="ml-6">
                      <div className="font-semibold text-green-700 dark:text-green-400 mb-1">Transação processada e confirmada com sucesso</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Quando ocorre:</strong> Após confirmação pelo gateway de pagamento
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-red-50'} transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="px-3 py-1 bg-red-500/15 text-red-600 rounded-full text-sm font-mono font-semibold">
                        FAILED
                      </span>
                    </div>
                    <div className="ml-6">
                      <div className="font-semibold text-red-700 dark:text-red-400 mb-1">Transação falhou ou foi rejeitada</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Quando ocorre:</strong> Após rejeição pelo gateway ou erro no processamento
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formato de Resposta */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">Formato de Resposta</h4>
                
                <div className="grid gap-4">
                  {/* Sucesso */}
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-green-500/20 bg-green-500/5' : 'border-green-200 bg-green-50'} transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-semibold text-green-700 dark:text-green-400">Sucesso</h5>
                        <span className="text-sm px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-mono">200</span>
                      </div>
                    </div>
                    <div className="ml-11">
                      <pre className={`text-sm ${isDarkMode ? 'bg-green-900/20' : 'bg-green-100'} p-3 rounded-lg border ${isDarkMode ? 'border-green-500/30' : 'border-green-200'}`}>
                        <code className="language-json text-green-800 dark:text-green-200">{`{"status": "COMPLETED"}`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Erro 404 */}
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-red-50'} transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-semibold text-red-700 dark:text-red-400">Transação não encontrada</h5>
                        <span className="text-sm px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded font-mono">404</span>
                      </div>
                    </div>
                    <div className="ml-11">
                      <pre className={`text-sm ${isDarkMode ? 'bg-red-900/20' : 'bg-red-100'} p-3 rounded-lg border ${isDarkMode ? 'border-red-500/30' : 'border-red-200'}`}>
                        <code className="language-json text-red-800 dark:text-red-200">{`{"error": "Transação não encontrada"}`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Erro 500 */}
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-amber-500/20 bg-amber-500/5' : 'border-amber-200 bg-amber-50'} transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-semibold text-amber-700 dark:text-amber-400">Erro interno</h5>
                        <span className="text-sm px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded font-mono">500</span>
                      </div>
                    </div>
                    <div className="ml-11">
                      <pre className={`text-sm ${isDarkMode ? 'bg-amber-900/20' : 'bg-amber-100'} p-3 rounded-lg border ${isDarkMode ? 'border-amber-500/30' : 'border-amber-200'}`}>
                        <code className="language-json text-amber-800 dark:text-amber-200">{`{"error": "Erro ao buscar transação"}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validações e Observações */}
              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h4 className="text-lg font-semibold mb-4">Validações e Observações</h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Validações</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <div><strong>Autenticação:</strong> Token JWT válido obrigatório</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <div><strong>Parâmetro:</strong> transaction_id deve existir na base de dados</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-3 text-orange-600 dark:text-orange-400">Observações Importantes</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <div><strong>Tempo Real:</strong> Status atualizado via callbacks dos gateways</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <div><strong>Enum Restrito:</strong> Apenas os 3 status listados são possíveis</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NOVO: SALDO */}
            <div id="saldo-conta" hidden={activeSection !== '#saldo-conta'} className="space-y-6">
              <h2 className="text-2xl font-semibold">{intl.formatMessage({ id: 'docs.balance.title' })}</h2>
              <p className="text-gray-400">
                Consulte seu saldo disponível e pendente.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-4 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                  <h4 className="font-semibold mb-2">Dicas</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                    <li>Sincronize saldos periodicamente e cacheie quando possível.</li>
                    <li>Considere limites de rate‑limit ao consultar com frequência.</li>
                  </ul>
                </div>
                <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-4 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                  <h4 className="font-semibold mb-2">Campos principais</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                    <li><code className="font-mono">balance</code>: saldo disponível.</li>
                  </ul>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'} overflow-hidden`}>
                <div className={`p-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs font-medium rounded">GET</span>
                    <code className="text-sm">/api/balance/getBalance</code>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded">{intl.formatMessage({ id: 'docs.common.authRequired' })}</span>
                </div>
                <div className="p-4 space-y-4">
                  <pre className="!bg-transparent">
                    <code className="language-bash">{balanceExample}</code>
                  </pre>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Resposta (200)</h4>
                    <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto`}>
                      <code className="language-json">{balanceExampleResponse}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* WEBHOOKS */}
            <div id="webhooks" hidden={activeSection !== '#webhooks'} className="space-y-6">
              <h2 className="text-2xl font-semibold">{intl.formatMessage({ id: 'docs.webhooks.title' })}</h2>
              <p className="text-gray-400">
                Os webhooks permitem que seu sistema receba notificações em tempo real sobre mudanças no status das transações de depósito e saque. Ao criar um depósito ou solicitação de saque, informe uma URL de callback (clientCallbackUrl) onde o sistema enviará atualizações.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                  <h4 className="text-lg font-semibold mb-4">Callback de Depósito</h4>
                  <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto`}>
                    <code>{`{
  "transaction_id": "id_da_transacao",
  "status": "COMPLETED",
  "amount": 100.00,
  "fee": -1.05,
  "net_amout": 98.95
}`}</code>
                  </pre>
                </div>

                <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                  <h4 className="text-lg font-semibold mb-4">Callback de Saque</h4>
                  <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto`}>
                    <code>{`{
  "transaction_id": "transaction-67890",
  "status": "COMPLETED",
  "amount": 50.00,
  "fee": -1.05,
  "ispb": 123456,
  "nome_recebedor": "Fulano Silva",
  "cpf_recebedor": "***212.43*-**"
}`}</code>
                  </pre>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <h3 className="text-xl font-semibold mb-4">Webhook de MED (Medida Cautelar)</h3>
                <p className="text-gray-400 mb-4">
                  O webhook de MED é um POST enviado para a URL de callback configurada quando uma transação é submetida a uma medida cautelar de bloqueio. Este webhook notifica sobre o status de retenção da transação para fins de conformidade e auditoria.
                </p>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-2">Estrutura do Payload</h4>
                  <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto`}>
                    <code>{`{
  "transaction_id": "id_da_transacao",
  "status": "RETIDO"
}`}</code>
                  </pre>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <h5 className="font-semibold text-amber-500 mb-2">Recomendação Técnica</h5>
                  <p className="text-sm text-amber-600">
                    É altamente recomendado implementar um sistema de logging robusto para registrar todos os webhooks de MED recebidos.
                    Isso facilita a auditoria, debugging e conformidade com regulamentações financeiras.
                    Considere armazenar timestamp, IP de origem, payload completo e status de processamento.
                  </p>
                </div>

                <div className="mt-4">
                  <h5 className="font-semibold mb-2">Exemplo de Implementação de Log</h5>
                  <pre className={`text-sm ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-100'} p-4 rounded-lg overflow-x-auto`}>
                    <code>{`// Exemplo de log recomendado
{
  "timestamp": "2024-02-20T15:30:22Z",
  "webhook_type": "MED",
  "transaction_id": "id_da_transacao",
  "status": "RETIDO",
  "source_ip": "192.168.1.1",
  "processed_at": "2024-02-20T15:30:23Z",
  "processing_status": "SUCCESS"
}`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* ERROS */}
            <div id="erros" hidden={activeSection !== '#erros'} className={`${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-white'} p-6 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
              <h2 className="text-xl font-semibold mb-4">{intl.formatMessage({ id: 'docs.errors.title' })}</h2>
              <p className="text-gray-400 mb-4">
                A API utiliza códigos de status HTTP para indicar o resultado de cada operação:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-medium rounded">400</span>
                  <span className="text-sm">Bad Request - Dados inválidos ou campos obrigatórios ausentes</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-medium rounded">401</span>
                  <span className="text-sm">Unauthorized - Credenciais inválidas ou token JWT não enviado</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-medium rounded">403</span>
                  <span className="text-sm">Forbidden - Acesso negado (IP não autorizado ou conta banida)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-medium rounded">404</span>
                  <span className="text-sm">Not Found - Recurso não encontrado</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-medium rounded">500</span>
                  <span className="text-sm">Internal Server Error - Erro no servidor</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
