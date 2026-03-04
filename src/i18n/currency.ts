import type { Locale } from './index';

/** Valores em BRL são convertidos para a moeda do locale. Taxas aproximadas - atualize conforme necessário. */
const BRL_TO_USD = 0.18;
const BRL_TO_EUR = 0.17;

export type DisplayCurrency = 'BRL' | 'USD' | 'EUR';

const LOCALE_CURRENCY: Record<Locale, { code: DisplayCurrency; rate: number }> = {
  pt: { code: 'BRL', rate: 1 },
  en: { code: 'USD', rate: BRL_TO_USD },
  es: { code: 'EUR', rate: BRL_TO_EUR },
};

/** Converte valor em BRL para a moeda do locale */
export function convertFromBRL(valueBRL: number, locale: Locale): number {
  return valueBRL * LOCALE_CURRENCY[locale].rate;
}

/** Retorna o código da moeda para o locale */
export function getCurrencyForLocale(locale: Locale): DisplayCurrency {
  return LOCALE_CURRENCY[locale].code;
}

const INTL_LOCALE_MAP: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

/** Retorna o símbolo da moeda para o locale (ex: R$, $, €) */
export function getCurrencySymbolForLocale(locale: Locale): string {
  const { code } = LOCALE_CURRENCY[locale];
  const parts = new Intl.NumberFormat(INTL_LOCALE_MAP[locale], { style: 'currency', currency: code }).formatToParts(1);
  return parts.find((p) => p.type === 'currency')?.value ?? code;
}

/** Formata valor (em BRL) na moeda do locale: PT=R$, EN=$, ES=€ */
export function formatCurrencyByLocale(
  valueBRL: number,
  locale: Locale,
  intlLocale: string
): string {
  const { code, rate } = LOCALE_CURRENCY[locale];
  const value = valueBRL * rate;
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: code,
  }).format(value);
}
