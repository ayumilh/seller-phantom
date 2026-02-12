import React, {useContext} from 'react';
import { 
  CreditCard, 
  Wallet, 
  BadgeDollarSign,
  BarChart3,
  Lock,
  ShieldCheck,
  Cpu,
  Gem,
  Code,
  Boxes
} from 'lucide-react';
import { ThemeContext } from '../lib/theme';
const icons = [
  CreditCard,
  Wallet,
  BadgeDollarSign,
  BarChart3,
  Lock,
  ShieldCheck,
  Cpu,
  Gem,
  Code,
  Boxes
];
import { useSelector } from 'react-redux';
interface FloatingIconProps {
  Icon: React.ElementType;
  initialX: number;
  initialY: number;
  speed: number;
  size: number;
  opacity: number;
}

function FloatingIcon({ Icon, initialX, initialY, speed, size, opacity }: FloatingIconProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        animation: `float-y ${speed}s ease-in-out infinite, float-x ${speed * 1.5}s ease-in-out infinite`,
        transform: 'translate(-50%, -50%)',
        opacity,
        color: 'var(--primary-color)' // ícones com cor primária
      }}
    >
      <Icon size={size} />
    </div>
  );
}

export function AuthBackground() {
     const isDarkMode  = useSelector((state) => state.themeAuth.isDarkModeAuth);
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Gradiente de fundo - pode ser ajustado também se quiser usar variáveis */}
       <div className={`absolute inset-0 ${isDarkMode ? 'bg-black' : 'bg-white'}`} />
      
      {/* Padrão de grade */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Ícones flutuantes */}
      {Array.from({ length: 20 }).map((_, i) => {
        const Icon = icons[i % icons.length];
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const speed = 3 + Math.random() * 4;
        const size = 16 + Math.random() * 24;
        const opacity = 0.1 + Math.random() * 0.2;

        return (
          <FloatingIcon
            key={i}
            Icon={Icon}
            initialX={initialX}
            initialY={initialY}
            speed={speed}
            size={size}
            opacity={opacity}
          />
        );
      })}

      {/* Efeitos de brilho com variável CSS */}
      <div
        className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: 'var(--primary-light)' }}
      />
      <div
        className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: 'var(--primary-light)' }}
      />
    </div>
  );
}
