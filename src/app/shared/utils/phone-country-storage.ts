import type { CountryCode } from 'libphonenumber-js/min';

/**
 * Persistência da preferência de país do campo de telefone (FR9). Isolada em
 * um util próprio (em vez de inline no componente) para:
 * - poder ser testada sem TestBed/DOM completo (mock de localStorage);
 * - manter o componente livre de try/catch de storage.
 *
 * `isBrowser` deve vir de `isPlatformBrowser(inject(PLATFORM_ID))` no
 * chamador — nunca lemos localStorage durante SSR/prerender (NFR2). Recebe
 * um `boolean` já resolvido (em vez do `PLATFORM_ID` cru) para manter a
 * assinatura simples de testar, sem acoplar este util ao tipo `Object` do
 * token do Angular.
 */
const STORAGE_KEY = 'contact:phone-country';

export function readStoredCountry(isBrowser: boolean): CountryCode | null {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(STORAGE_KEY) as CountryCode | null;
  } catch {
    // Safari em modo privado, quota estourada, storage bloqueado por política
    // do navegador, etc. Não é crítico: só não persiste, cai no default BR.
    return null;
  }
}

export function writeStoredCountry(isBrowser: boolean, country: CountryCode): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, country);
  } catch {
    // idem — falha silenciosa é aceitável aqui.
  }
}
