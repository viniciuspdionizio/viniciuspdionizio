import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { from, map, of } from 'rxjs';
import type { CountryCode } from 'libphonenumber-js/min';
import { loadPhoneLib } from '../utils/phone-lib-loader';

/**
 * Validador assíncrono de telefone (FR4), estrutural e ciente de país —
 * substitui a antiga regex genérica. Precisa ser assíncrono por causa do
 * import() dinâmico da metadata de telefone (ver phone-lib-loader.ts).
 *
 * `getCountry` é uma função (não um país fixo) porque o usuário pode trocar
 * o país selecionado depois que o validator já foi registrado no
 * FormControl — cada validação lê o país *atual* no momento em que roda.
 *
 * Chave de erro: `invalidPhone` (não colide com o antigo `pattern`).
 */
export function phoneNumberValidator(getCountry: () => CountryCode): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const value = String(control.value ?? '').trim();

    // Campo opcional (FR3): vazio é sempre válido, não dispara o import().
    if (!value) return of(null as ValidationErrors | null);

    return from(loadPhoneLib()).pipe(
      map(({ isValidPhoneNumber }) =>
        isValidPhoneNumber(value, getCountry()) ? null : { invalidPhone: true }
      )
    );
  };
}
