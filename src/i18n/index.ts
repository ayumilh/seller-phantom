export const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pt';

const LOCALE_STORAGE_KEY = 'phantompay_locale';

export function getStoredLocale(): Locale | null {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }
  return null;
}

export function setStoredLocale(locale: Locale): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function getIntlLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES',
  };
  return map[locale];
}

const LOCALE_MODULES = ['auth', 'nav', 'sidebar', 'common', 'dashboard', 'wallet', 'settings', 'awards', 'reports', 'apps', 'docs', 'modals', 'pages'] as const;

export async function loadMessages(locale: Locale): Promise<Record<string, string>> {
  const modules = await Promise.all(
    LOCALE_MODULES.map((mod) => import(`./locales/${locale}/${mod}.json`))
  );
  return Object.assign({}, ...modules.map((m) => m.default));
}
