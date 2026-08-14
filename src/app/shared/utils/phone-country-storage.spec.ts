import { readStoredCountry, writeStoredCountry } from './phone-country-storage';

const STORAGE_KEY = 'contact:phone-country';

describe('phone-country-storage', () => {
  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  describe('em contexto de browser (isBrowser = true)', () => {
    it('retorna null quando não há preferência salva', () => {
      expect(readStoredCountry(true)).toBeNull();
    });

    it('grava e depois lê a preferência salva', () => {
      writeStoredCountry(true, 'US');
      expect(readStoredCountry(true)).toBe('US');
    });

    it('sobrescreve uma preferência anterior', () => {
      writeStoredCountry(true, 'BR');
      writeStoredCountry(true, 'PT');
      expect(readStoredCountry(true)).toBe('PT');
    });

    it('não propaga erro se o localStorage lançar exceção ao ler', () => {
      spyOn(localStorage, 'getItem').and.throwError('quota exceeded');
      expect(() => readStoredCountry(true)).not.toThrow();
      expect(readStoredCountry(true)).toBeNull();
    });

    it('não propaga erro se o localStorage lançar exceção ao escrever', () => {
      spyOn(localStorage, 'setItem').and.throwError('quota exceeded');
      expect(() => writeStoredCountry(true, 'BR')).not.toThrow();
    });
  });

  describe('fora de contexto de browser (isBrowser = false, SSR/prerender)', () => {
    it('nunca lê localStorage e retorna null', () => {
      const spy = spyOn(localStorage, 'getItem');
      expect(readStoredCountry(false)).toBeNull();
      expect(spy).not.toHaveBeenCalled();
    });

    it('nunca escreve no localStorage', () => {
      const spy = spyOn(localStorage, 'setItem');
      writeStoredCountry(false, 'BR');
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
