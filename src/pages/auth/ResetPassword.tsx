import React, { useState, useMemo, useLayoutEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

/**
 * BOOT DO TEMA (ANTES DE QUALQUER RENDER)
 * - Default: DARK (se não houver nada salvo)
 * - Respeita localStorage caso já exista
 */
(function ensureThemeClassEarly() {
  try {
    const saved = localStorage.getItem('isDarkModeAuth');
    // Padrão: dark = true. Se já existe no localStorage, usa o salvo.
    const wantsDark = saved === null ? true : saved === 'true';
    document.documentElement.classList.toggle('dark', wantsDark);
  } catch {
    document.documentElement.classList.add('dark');
  }
})();

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/auth';

export default function ResetPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [senha, setSenha] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const token = useMemo(() => search.get('token') || '', [search]);

  /**
   * Sincroniza Redux com o estado REAL do DOM (classe .dark já aplicada no boot).
   * useLayoutEffect minimiza qualquer flash.
   */
  useLayoutEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      toast.error('Token inválido ou ausente.');
      return;
    }
    if (senha.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (senha !== confirm) {
      toast.error('As senhas não conferem.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nova_senha: senha }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success('Senha redefinida com sucesso.');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        //alterar o if depois de padronizar
        const errorMessage = data?.message || data?.erro || data?.error || 'Não foi possível redefinir sua senha.';
        toast.error(errorMessage);
      }
    } catch {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function redirectLogin() {
    navigate('/login');
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[var(--background-color)] text-white">
      {/* Imagem lado esquerdo */}
      <div
        className="hidden md:block h-full w-full"
        style={{
          backgroundImage:
            "var(--hero-bg-image)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Formulário */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">
            Redefinir senha
          </h2>
          <p className="text-sm mt-1 text-gray-300">
            Defina uma nova senha para sua conta.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleReset}>
          <div className="space-y-3">
            <div className="relative">
              <input
                type="password"
                name="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 pr-10 placeholder:text-gray-400"
                placeholder="Nova senha"
                minLength={8}
                required
              />
              <Lock size={18} className="absolute right-3 top-3.5 opacity-70" />
            </div>

            <div className="relative">
              <input
                type="password"
                name="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 pr-10 placeholder:text-gray-400"
                placeholder="Confirmar nova senha"
                minLength={8}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-white rounded-lg transition-colors text-base font-medium bg-[var(--primary-color)] hover:bg-[color:var(--primary-dark)]"
          >
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>

          <div className="flex justify-center items-center -ml-5 hover:cursor-pointer">
            <span
              className="text-nowrap text-sm flex gap-2 p-2 text-gray-300"
              onClick={redirectLogin}
            >
              <ArrowLeft size={20} />
              Voltar para o login
            </span>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
