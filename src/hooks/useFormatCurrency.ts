import { useCallback } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { getIntlLocale } from '../i18n';
import { formatCurrencyByLocale, getCurrencySymbolForLocale } from '../i18n/currency';

/** Formata valor em BRL na moeda do locale: PT=R$, EN=$, ES=€ */
export function useFormatCurrency() {
  const { locale } = useLocale();
  const intlLocale = getIntlLocale(locale);

  return useCallback(
    (valueBRL: number) => formatCurrencyByLocale(valueBRL, locale, intlLocale),
    [locale, intlLocale]
  );
}

/** Retorna o símbolo da moeda do locale (ex: R$, $, €) */
export function useCurrencySymbol() {
  const { locale } = useLocale();
  return getCurrencySymbolForLocale(locale);
}
