import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/auth';

export default function ForgotPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);

  async function forgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/password/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      // A API responde de forma genérica por segurança
      if (res.ok) {
        toast.success('Se o e-mail existir, enviaremos instruções de redefinição.');
        // Opcional: redirecionar após alguns segundos
        setTimeout(() => navigate('/login'), 1200);
      } else {
        const data = await res.json().catch(() => ({}));
        //alterar o if depois de padrozinar
        const errorMessage = data?.message || data?.erro || data?.error || 'Não foi possível processar sua solicitação.';
        toast.error(errorMessage);
      }
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error.message || 'Erro de conexão. Tente novamente.');
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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">
            Esqueceu sua senha?
          </h2>
          <p className="text-sm mt-1 text-gray-300">
            Recupere o acesso à sua conta!
          </p>
        </div>

        <form className="space-y-6" onSubmit={forgotPassword}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
            placeholder="Digite seu e-mail"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-white rounded-lg transition-colors text-base font-medium bg-[var(--primary-color)] hover:bg-[color:var(--primary-dark)]"
          >
            {loading ? (
              'Enviando...'
            ) : (
              <div className="flex justify-center items-center gap-3">
                <Send size={18} />
                Enviar instruções
              </div>
            )}
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
