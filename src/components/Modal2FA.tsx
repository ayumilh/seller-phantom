import React, { useState, useRef, useEffect } from "react";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export function Modal2FA({ codigo2fa, onClose }: { codigo2fa?: string | null; onClose: () => void }) {
  const isDarkMode = useSelector((state: any) => state.themeAuth.isDarkModeAuth);
  const length = 6;
  const [valuesCode, setValuesCode] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();
  const [loadingNewCode, setLoadingNewCode] = useState(false);
  const [loadingSendCode, setLoadingSendCode] = useState(false);

  // trava o scroll do body enquanto o modal está aberto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // preenche com codigo2fa quando fornecido pela API (email desabilitado)
  useEffect(() => {
    if (codigo2fa && codigo2fa.length === 6) {
      setValuesCode(codigo2fa.split(""));
    }
  }, [codigo2fa]);

  // foca no primeiro input vazio ao abrir/alterar
  useEffect(() => {
    const firstEmpty = valuesCode.findIndex((v) => v === "");
    if (firstEmpty >= 0) {
      inputsRef.current[firstEmpty]?.focus();
    }
  }, [valuesCode]);

  // quando preencher todos, envia
  useEffect(() => {
    if (valuesCode.every((v) => v !== "")) {
      handleSendCode();
    }
  }, [valuesCode]);

  const distributeDigits = (startIndex: number, digits: string) => {
    const onlyDigits = digits.replace(/\D/g, "");
    if (!onlyDigits) return;

    const arr = [...valuesCode];
    let idx = startIndex;

    for (const ch of onlyDigits) {
      if (idx >= length) break;
      arr[idx] = ch;
      idx++;
    }
    setValuesCode(arr);

    // move foco para o próximo campo após o último preenchido
    if (idx < length) {
      inputsRef.current[idx]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const raw = e.target.value;

    // aceita colagem/auto-fill múltiplos dígitos
    if (raw.length > 1) {
      distributeDigits(index, raw);
      return;
    }

    const digit = raw.replace(/\D/g, ""); // apenas dígitos
    const arr = [...valuesCode];
    arr[index] = digit || "";
    setValuesCode(arr);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    distributeDigits(index, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const arr = [...valuesCode];
      if (arr[index]) {
        arr[index] = "";
        setValuesCode(arr);
        return;
      }
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      if (valuesCode.every((v) => v !== "")) {
        handleSendCode();
      }
    }
  };

  const handleSendCode = async () => {
    try {
      if (loadingSendCode) return;
      setLoadingSendCode(true);

      const user_id = localStorage.getItem("user_id");
      const valuesCodeString = valuesCode.join("");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/validate-two-fa`,
        { code: valuesCodeString, user_id }
      );

      const token = response.data.token;
      const agora = new Date();
      const expiracao = new Date(agora.getTime() + 55 * 60 * 1000);

      localStorage.setItem("token", token);
      localStorage.setItem("token_expira_em", expiracao.toISOString());
      navigate("/");
    } catch (err) {
      //alterar if depois de padronizar
      const error = err as { response?: { data?: { message?: string, erro?: string, error?: string } } };
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.erro || 
                          error?.response?.data?.error ||
                          "Código inválido. Tente novamente.";
      
      toast.error(errorMessage);
      console.log("Erro ao enviar código!", err);
      setValuesCode(Array(length).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoadingSendCode(false);
    }
  };

  const Backdrop: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
    <div
      {...props}
      className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? "bg-black/50" : "bg-black/50"}`}
      // fecha apenas se clicar no backdrop (não dentro do conteúdo)
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    />
  );

  if (loadingSendCode) {
    return (
      <Backdrop>
        <div className="flex items-center justify-center gap-3 p-4 rounded-lg"
             style={{ backgroundColor: isDarkMode ? "#0b0b0b" : "#ffffff" }}>
          <Loader className="animate-spin text-[var(--primary-color)]" size={32} />
          <p className={isDarkMode ? "text-white" : "text-black"}>
            Verificando código de autorização, por favor aguarde...
          </p>
        </div>
      </Backdrop>
    );
  }

  if (loadingNewCode) {
    return (
      <Backdrop>
        <div className="flex items-center justify-center gap-3 p-4 rounded-lg"
             style={{ backgroundColor: isDarkMode ? "#0b0b0b" : "#ffffff" }}>
          <Loader className="animate-spin text-[var(--primary-color)]" size={32} />
          <p className={`ml-1 ${isDarkMode ? "text-white" : "text-black"}`}>
            Gerando novo código de autorização, por favor aguarde...
          </p>
        </div>
      </Backdrop>
    );
  }

  return (
    <Backdrop role="dialog" aria-modal="true">
      <div
        className="backdrop-blur-xl rounded-xl p-8 shadow-xl border max-w-md w-full mx-4"
        style={{
          backgroundColor: isDarkMode
            ? "var(--background-fix-auth, #000)"
            : "var(--card-background, #fff)",
          borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
        }}
        // impede que cliques/touches internos fechem o modal no mobile
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? "text-white" : "text-black"}`}>
            Código para realizar login!
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? "text-white" : "text-black"}`}>
            {codigo2fa
              ? "Use o código abaixo para validar seu login (e-mail temporariamente indisponível):"
              : "Enviamos um código para o seu email, para validar seu login."}
          </p>
          {codigo2fa && (
            <p className={`text-2xl font-bold mt-3 tracking-widest ${isDarkMode ? "text-[var(--primary-color)]" : "text-[var(--primary-color)]"}`}>
              {codigo2fa}
            </p>
          )}
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-black"}`}>
              Código
            </label>

            <div className="flex gap-2">
              {valuesCode.map((val, idx) => (
                <input
                  key={idx}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={val}
                  ref={(el) => (inputsRef.current[idx] = el!)}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={(e) => handlePaste(e, idx)}
                  className={`w-full h-12 rounded-lg border-2 focus:ring-0 text-lg px-4 font-semibold ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                  style={{
                    backgroundColor: isDarkMode ? "#141414ff" : "#fff",
                    borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "black",
                    // previne zoom no iOS (mantendo fonte >= 16px)
                    fontSize: "18px",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className={`text-sm mt-1 ${isDarkMode ? "text-white" : "text-black"}`}>
              Seu código é válido por apenas 15 minutos!
            </p>
          </div>

          <button
            type="button"
            className="w-full h-12 text-white rounded-lg transition-colors text-base font-medium"
            style={{ backgroundColor: "var(--primary-color)", cursor: "pointer" }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--primary-light)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--primary-color)";
            }}
            onClick={handleSendCode}
          >
            {loadingSendCode ? "Enviando..." : "Enviar código"}
          </button>
        </form>
      </div>
    </Backdrop>
  );
}
