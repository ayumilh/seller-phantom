import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../../dist/assets/logo.png';
import { Modal2FA } from '../../components/Modal2FA';
import {toast} from 'sonner';
import { useDispatch } from 'react-redux';
export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [emAprovacao, setEmAprovacao] = useState(false);
  const [modal2FA, setModal2FA] = useState(false);
  const [codigo2fa, setCodigo2fa] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Fixa o tema em escuro globalmente
    document.documentElement.classList.add('dark');
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login-user`,
        { email, senha }
      );

      const send_twofa = response.data.send_twofa;

      if (send_twofa) {
        const { status, send_docs, name, id } = response.data.user;
        const codigo2fa = response.data.codigo2fa;

        if (status === true) {

          localStorage.setItem('username', name);
          localStorage.setItem('user_id', id);

          setModal2FA(true);
          setCodigo2fa(codigo2fa || null);

        } else if (status === false && send_docs === 1) {
          setEmAprovacao(true);

        } else if (status === false && send_docs === 0) {
          navigate('/register', { 
            state: { 
              startStep: 'company',
              type: 'CPF',
              userId: response.data.user.id
            }
          });

        }

      } else {
        toast.error('Credenciais inválidas. Tente novamente.');
        setLoading(false);
      }

    } catch (err) {
      console.error('Erro ao fazer login:', err);
      
      //alterar if depois de padronizar
      const error = err as { response?: { data?: { message?: string, erro?: string, error?: string } } };
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.erro || 
                          error?.response?.data?.error ||
                          'Erro ao fazer login. Verifique suas credenciais!';
      
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  function redirectPageForgotPassword(){
      navigate('/forgotPassword');
  }

  return (
    <div
      className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[var(--background-color)] text-white"
    >
      {/* Coluna esquerda: imagem ocupando 50% */}
      <div
        className="hidden md:block h-full w-full"
        style={{
          backgroundImage:
            "var(--hero-bg-image)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Coluna direita: formulário */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <img src={logo} alt="Logo" className="w-30 h-10" />
            </h1>
          </div>

          {/* 👇 Tela de aprovação de conta */}
          {emAprovacao ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-3">Aguardando aprovação</h2>
              <p className="text-sm text-gray-300">
                Estamos verificando seus documentos.<br />
                Isso pode levar até <strong>48 horas</strong>.
              </p>
            </div>
          ) : (
            // 👇 Tela de login normal diretamente no background
            <div className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold">Bem-vindo de volta!</h2>
                <p className="text-sm mt-1 text-gray-300">Faça login na sua conta</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                    placeholder="Digite seu email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                    placeholder="Digite sua senha"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setRemember(!remember)}
                    className="flex items-center gap-3 group"
                    aria-pressed={remember}
                  >
                    <span
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${remember ? 'bg-[var(--primary-color)]' : 'bg-white/10'}`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow ${remember ? 'translate-x-5' : 'translate-x-1'}`}
                      />
                    </span>
                    <span className="text-sm text-gray-300">Lembrar-me</span>
                  </button>
                  <a href="#" className="text-sm" style={{ color: 'var(--primary-color)' }} onClick={redirectPageForgotPassword}>
                    Esqueceu a senha?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-white rounded-lg transition-colors text-base font-medium bg-[var(--primary-color)] hover:bg-[color:var(--primary-dark)]"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="ml-2 text-sm text-gray-300">
                  Ainda não tem uma conta?{' '}
                  <Link
                    to="/register"
                    className="hover:underline"
                    style={{ color: 'var(--primary-color)' }}
                  >
                    Criar conta
                  </Link>
                </p>
              </div>
            </div>
          )}

          {modal2FA && (
            <Modal2FA
              codigo2fa={codigo2fa}
              onClose={() => {
                setModal2FA(false);
                setCodigo2fa(null);
                setLoading(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}