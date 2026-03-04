import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IntlProvider } from 'react-intl';
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type Locale,
  getStoredLocale,
  setStoredLocale,
  getIntlLocale,
  loadMessages,
} from '../i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const LOADING_BY_LOCALE: Record<Locale, string> = {
  pt: 'Carregando...',
  en: 'Loading...',
  es: 'Cargando...',
};

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}

interface LocaleProviderProps {
  children: React.ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [messages, setMessages] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
    loadMessages(newLocale).then(setMessages);
  }, []);

  useEffect(() => {
    const stored = getStoredLocale();
    const initial = (stored ?? DEFAULT_LOCALE) as Locale;
    setLocaleState(initial);

    loadMessages(initial)
      .then((msgs) => {
        setMessages(msgs);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !messages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-color)]">
        <div className="animate-pulse text-white/60">{LOADING_BY_LOCALE[locale]}</div>
      </div>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isLoading }}>
      <IntlProvider locale={getIntlLocale(locale)} messages={messages} defaultLocale="pt-BR">
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}
