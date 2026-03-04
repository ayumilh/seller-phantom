import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import type { Locale } from '../i18n';
import { ChevronDown } from 'lucide-react';

const LOCALE_LABELS: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
};

const LOCALE_FLAGS: Record<Locale, string> = {
  pt: '🇧🇷',
  en: '🇺🇸',
  es: '🇪🇸',
};

const LOCALE_CODES: Record<Locale, string> = {
  pt: 'PT',
  en: 'EN',
  es: 'ES',
};

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (l: Locale) => {
    setLocale(l);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
        aria-label="Selecionar idioma"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-base">{LOCALE_FLAGS[locale]}</span>
        <span className="font-medium">{LOCALE_CODES[locale]}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[160px] py-1 rounded-lg bg-[var(--card-background)] border border-white/10 shadow-xl z-50"
          role="listbox"
        >
          {(['en', 'es', 'pt'] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              role="option"
              aria-selected={locale === l}
              onClick={() => handleSelect(l)}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                locale === l ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span className="text-base">{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_LABELS[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
