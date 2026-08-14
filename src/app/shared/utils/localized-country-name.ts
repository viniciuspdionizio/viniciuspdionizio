import type { Country } from '../data/countries';

/**
 * COUNTRIES (shared/data/countries.ts) é gerado estaticamente em pt-BR (ver
 * scripts/generate-countries.js). Para exibir o nome do país no idioma da
 * build atual sem precisar manter um arquivo gerado por idioma, re-traduzimos
 * via Intl.DisplayNames — disponível tanto no browser quanto no Node/SSR.
 * Usado por CountrySelectComponent e por ContactComponent (fallback de
 * mailto:, ver formatPhoneForMailto).
 */
export function localizedCountryName(country: Country, locale: string): string {
  if (locale.toLowerCase().startsWith('pt') || typeof Intl === 'undefined' || !Intl.DisplayNames) {
    return country.name;
  }
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(country.iso2) ?? country.name;
  } catch {
    return country.name;
  }
}
