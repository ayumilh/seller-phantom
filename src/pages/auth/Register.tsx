  import React, { useRef, useState, useEffect } from 'react';
  import { Link, useLocation } from 'react-router-dom';
  import { Loader2 } from 'lucide-react';
  import axios from 'axios';
  import InputMask from 'react-input-mask';
  import logo from '../../../dist/assets/logo.png';
  import { toast } from 'sonner';
  import { useSelector } from 'react-redux';
  import type { RootState } from '../../lib/store';
  type Step = 'personal' | 'company' | 'doc' | 'verification';

  export default function Register() {
    const location = useLocation();
    const startStep = location.state?.startStep || 'personal';
    const [currentStep, setCurrentStep] = useState<Step>(startStep);
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [documento, setDocumento] = useState('');
    const [type, setType] = useState<string>(location.state?.type || 'Indefinido');
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [userId, setUserId] = useState<string>(location.state?.userId || '');
    const docFrontRef = useRef<HTMLInputElement | null>(null);
    const docBackRef = useRef<HTMLInputElement | null>(null);
    const selfieRef = useRef<HTMLInputElement | null>(null);
    const isDarkMode  = useSelector((state: RootState) => state.themeAuth.isDarkModeAuth);
    // Fixa o tema em escuro
    useEffect(() => { document.documentElement.classList.add('dark'); }, []);

    useEffect(() => {
      const fetchAddress = async () => {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
          try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();
            if (!data.erro) {
              setEndereco(data.logradouro);
              setCidade(data.localidade);
              setEstado(data.uf);
            }
          } catch (error) {
            console.error('Erro ao buscar endereço:', error);
          }
        }
      };

      fetchAddress();
    }, [cep]);
    
    const handleSubmitDocs = async (e: any) => {
      e.preventDefault();
      setLoading(true);

      
      const formData = new FormData();
      const front = docFrontRef.current?.files?.[0];
      const back = docBackRef.current?.files?.[0];
      const selfie = selfieRef.current?.files?.[0];
      if (front) formData.append('doc_front', front);
      if (back) formData.append('doc_back', back);
      if (selfie) formData.append('photo_with_doc', selfie);
      formData.append('client_id', userId);
      formData.append('type_doc', type);
      formData.append('cep', cep);
      formData.append('endereco', endereco);
      formData.append('estado', estado);
      formData.append('cidade', cidade);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/upload-docs`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Erro no upload');
        console.log('Arquivos salvos com sucesso:', data);
        setCurrentStep('verification');
      } catch (err) {
        //alterar if depois de padronizar
        const error = err as { response?: { data?: { message?: string, erro?: string, error?: string } }, message?: string };
        const errorMessage = error?.response?.data?.message || 
                            error?.response?.data?.erro || 
                            error?.response?.data?.error ||
                            error.message ||
                            'Erro ao enviar documentos';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    const isValidCPF = (cpf: string) => {
      const clean = cpf.replace(/\D/g, '');
      if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;
  
      let sum = 0;
      for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i);
      let rest = (sum * 10) % 11;
      if (rest === 10 || rest === 11) rest = 0;
      if (rest !== parseInt(clean[9])) return false;
  
      sum = 0;
      for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i);
      rest = (sum * 10) % 11;
      if (rest === 10 || rest === 11) rest = 0;
  
      return rest === parseInt(clean[10]);
    };
    
    const detectTypeValueDocument = (value: string) => {
      const cleanValueDocument = value.replace(/\D/g, '');
      if (cleanValueDocument.length === 11) return isValidCPF(cleanValueDocument) ? 'CPF' : 'Indefinido ';
      if (cleanValueDocument.length === 14) return 'CNPJ';
      return 'Indefinido';
    };
    const handleChangeDocumento = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const clean = raw.replace(/\D/g, '');
      const probable = detectTypeValueDocument(raw);
      const currentClean = documento.replace(/\D/g, '');
  
      if (type === 'CNPJ' && currentClean.length === 14 && clean.length > 14) {
        return;
      }
      
      const masked = maskValue(raw, probable);
      setDocumento(masked);
      setType(probable);
    };

    const maskValue = (value: string, detected: string) => {
      const cleanValue = value.replace(/\D/g, '');

      switch (detected) {
        case 'CPF':
          return cleanValue
            .slice(0, 11)
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        case 'CNPJ':
          return cleanValue
            .slice(0, 14)
            .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        default:
          return value;
      }
    };

    const handleCompanyDataSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      const documentoLimpo = documento.replace(/\D/g, '');
      const telefoneLimpo = telefone.replace(/\D/g, '');
      try {
        if (email !== ''){
          const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
            { nome, email, senha, telefone: telefoneLimpo, documento: documentoLimpo }
          );
          setUserId(response.data.user.id);
        }
        setCurrentStep('doc');
      } catch (erro) {
        //alterar if depois de padronizar
        const error = erro as { response?: { data?: { message?: string, erro?: string, error?: string } } };
        const errorMessage = error?.response?.data?.message || 
                            error?.response?.data?.erro || 
                            error?.response?.data?.error ||
                            'Erro ao cadastrar usuário';
        toast.error(errorMessage);
      }
      setLoading(false); 
    };
    const renderStep = () => {
      switch (currentStep) {
        case 'personal':
          return (
            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep('company'); }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                    placeholder="Digite seu nome"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Telefone
                  </label>
                  <InputMask mask="(99) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)}>
                    {(inputProps: any) => (
                    <input
                    {...inputProps}
                    type="tel"
                    className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                    placeholder="(00) 00000-0000"
                    required
                      />
                      )}
                  </InputMask>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                    placeholder="Digite seu email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                      CPF / CNPJ
                    </label>
                  <input
                    type="text"
                    value={documento}
                    onChange={handleChangeDocumento}
                    placeholder="Digite CPF ou CNPJ"
                    className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                    placeholder="Digite sua senha"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={ telefone.replace(/\D/g, '').length < 11}
                  className="w-full h-12 bg-[color:var(--primary-color)] text-white rounded-lg hover:hover:bg-[color:var(--primary-color)]/80 transition-colors text-base font-medium"
                >
                  Continuar
                </button>
              </div>
            </form>
          );

        case 'company':
          return (
            <form onSubmit={handleCompanyDataSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    CEP
                  </label>
                  <InputMask
                    mask="99999-999"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                  >
                    {(inputProps: any) => (
                      <input
                        {...inputProps}
                        type="text"
                        className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                        placeholder="00000-000"
                        required
                      />
                    )}
                  </InputMask>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                    placeholder="Rua, número, complemento"
                    required
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                    placeholder="Cidade"
                    required
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 placeholder:text-gray-400"
                    placeholder="Estado"
                    required
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-12 bg-[color:var(--primary-color)] text-white rounded-lg hover:hover:bg-[color:var(--primary-color)]/80 transition-colors text-base font-medium flex items-center justify-center"
                  disabled={loading || type === 'Indefinido'}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Consultando dados...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </button>
              </div>
            </form>
          );

        case 'doc':
          return (
            <form onSubmit={handleSubmitDocs}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" >
                    Foto da frente do documento
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.heic,.heif,.tiff,.tif,.jfif,.dng,.raw,.cr2,.nef,.arw,.orf,.rw2,.pdf"
                    ref={docFrontRef}
                    className={`w-full pt-1 h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 file:text-white file:bg-[color:var(--primary-color)] file:border-0 file:rounded file:px-4 file:py-2`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Foto do verso do documento
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.heic,.heif,.tiff,.tif,.jfif,.dng,.raw,.cr2,.nef,.arw,.orf,.rw2,.pdf"
                    ref={docBackRef}
                    className={`w-full pt-1 h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 file:text-white file:bg-[color:var(--primary-color)] file:border-0 file:rounded file:px-4 file:py-2`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Selfie segurando o documento
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.heic,.heif,.tiff,.tif,.jfif,.dng,.raw,.cr2,.nef,.arw,.orf,.rw2,.pdf"
                    ref={selfieRef}
                    className={`w-full pt-1 h-12 rounded-lg border border-white/10 bg-[#0f1114] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white text-base px-4 file:text-white file:bg-[color:var(--primary-color)] file:border-0 file:rounded file:px-4 file:py-2`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[color:var(--primary-color)] text-white rounded-lg hover:bg-[color:var(--primary-color)]/80 transition-colors text-base font-medium"
                >
                  {loading ? 'Enviando...' : 'Finalizar cadastro'}
                </button>
              </div>
            </form>
          );

        case 'verification':
          return (
            <div className="text-center">
              <div className="w-16 h-16 bg-[color:var(--primary-color)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 size={32} className="text-[color:var(--primary-color)] animate-spin" />
              </div>
              <h3 className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>Verificação de conta</h3>
              <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                Em até 24 horas sua conta será verificada.
              </p>
            </div>
          );
      }
    };
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[var(--background-color)] text-white register-dark">
        {/* Imagem esquerda */}
        <div
          className="hidden md:block h-full w-full"
          style={{
            backgroundImage:
              "var(--hero-bg-image)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Conteúdo sem card, direto no fundo escuro */}
        <div className="flex items-center justify-center p-6 md:p-12">
        <div className="relative w-full max-w-md" >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2 text-white">
              <img src={logo} alt="Logo" className="w-30 h-10" />
            </h1>
          </div>

          <div className="w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold">Criar conta</h2>
              <p className="text-sm mt-1 text-gray-300">
                {currentStep === 'verification'
                  ? 'Aguardando verificação'
                  : 'Preencha os dados para criar sua conta'}
              </p>
            </div>

            {/* Progress Steps */}
            {currentStep !== 'verification' && (
              <div className="flex items-center justify-between mb-8">
                {(['personal', 'company', 'address'] as Step[]).map((step, index) => (
                  <React.Fragment key={step}>
                    <div className="flex items-center">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm
                        ${currentStep === step ? 'bg-[color:var(--primary-color)] text-white' : 
                          index < ['personal', 'company', 'address'].indexOf(currentStep) + 1 
                            ? 'bg-[color:var(--primary-color)]/20 text-[color:var(--primary-color)]' 
                            : 'bg-[#1E1E2E] text-white'}
                      `}>
                        {index + 1}
                      </div>
                    </div>
                    {index < 2 && (
                      <div className={`
                        flex-1 h-0.5 mx-2
                        ${index < ['personal', 'company', 'address'].indexOf(currentStep) 
                          ? 'bg-[color:var(--primary-color)]/20' 
                          : 'bg-[#1E1E2E]'}
                      `} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {renderStep()}

            {currentStep !== 'verification' && (
              <div className="mt-6 text-center">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-[color:var(--primary-color)] hover:hover:text-[color:var(--primary-color)]/80">
                    Fazer login
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    );
  }