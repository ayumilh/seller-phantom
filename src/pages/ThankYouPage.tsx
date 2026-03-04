import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { CheckCircle, Package, Mail, Sparkles, Heart, Gift } from 'lucide-react';

export default function ThankYouPage() {
  const intl = useIntl();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowConfetti(true), 500);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
        ))}
        
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-[var(--primary-color)] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold animate-slide-up">
            {intl.formatMessage({ id: 'pages.thankYou.title' })} 🎉
          </h1>
          <p className="text-xl mt-2 opacity-90 animate-fade-in-up">
            {intl.formatMessage({ id: 'pages.thankYou.subtitle' })}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Success Animation */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white animate-check-mark" />
            </div>
            <div className="absolute -top-4 -right-4 animate-bounce-delayed">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
            <div className="absolute -bottom-2 -left-4 animate-bounce-delayed-2">
              <Gift className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in-up">
            {intl.formatMessage({ id: 'pages.thankYou.orderConfirmed' })}
          </h2>
          <p className="text-xl text-gray-600 animate-fade-in-up-delayed">
            {intl.formatMessage({ id: 'pages.thankYou.emailInfo' })}
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center animate-slide-up shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">{intl.formatMessage({ id: 'pages.thankYou.processing' })}</h4>
            <p className="text-sm text-gray-600">{intl.formatMessage({ id: 'pages.thankYou.processingDesc' })}</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center animate-slide-up-delayed shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">{intl.formatMessage({ id: 'pages.thankYou.emailSent' })}</h4>
            <p className="text-sm text-gray-600">{intl.formatMessage({ id: 'pages.thankYou.emailSentDesc' })}</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center animate-slide-up-delayed-2 shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <Gift className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">{intl.formatMessage({ id: 'pages.thankYou.delivery' })}</h4>
            <p className="text-sm text-gray-600">
              {intl.formatMessage({ id: 'pages.thankYou.deliveryDesc' })}
            </p>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-[var(--primary-color)] text-white rounded-2xl p-8 text-center animate-pulse-glow shadow-2xl">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 mr-3 animate-bounce" />
            <h3 className="text-2xl font-bold">{intl.formatMessage({ id: 'pages.thankYou.allDone' })}</h3>
          </div>
          <p className="text-xl mb-4 opacity-90">
            {intl.formatMessage({ id: 'pages.thankYou.allDoneDesc' })}
          </p>
          <p className="text-lg opacity-80">
            {intl.formatMessage({ id: 'pages.thankYou.thanks' })} 💜
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg animate-fade-in-up-delayed">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">{intl.formatMessage({ id: 'pages.thankYou.whatNext' })}</h4>
            <div className="space-y-2 text-gray-600">
              <p>✅ {intl.formatMessage({ id: 'pages.thankYou.confirmEmail' })}</p>
              <p>📦 {intl.formatMessage({ id: 'pages.thankYou.preparing' })}</p>
              <p>🚚 {intl.formatMessage({ id: 'pages.thankYou.tracking' })}</p>
              <p>💬 {intl.formatMessage({ id: 'pages.thankYou.support' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-100 text-gray-500 py-8 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm opacity-75">
            © {new Date().getFullYear()} {intl.formatMessage({ id: 'pages.thankYou.footer' })}
          </p>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(-90deg); opacity: 0.8; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes check-mark {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes slide-up {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4); }
        }
        
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-confetti { animation: confetti 3s linear forwards; }
        .animate-scale-in { animation: scale-in 0.8s ease-out forwards; }
        .animate-check-mark { animation: check-mark 0.6s ease-out 0.4s forwards; transform: scale(0); }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-slide-up-delayed { animation: slide-up 0.8s ease-out 0.2s forwards; opacity: 0; }
        .animate-slide-up-delayed-2 { animation: slide-up 0.8s ease-out 0.4s forwards; opacity: 0; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out 0.6s forwards; opacity: 0; }
        .animate-fade-in-up-delayed { animation: fade-in-up 0.8s ease-out 0.8s forwards; opacity: 0; }
        .animate-bounce-delayed { animation: bounce 2s infinite 0.5s; }
        .animate-bounce-delayed-2 { animation: bounce 2s infinite 1s; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}