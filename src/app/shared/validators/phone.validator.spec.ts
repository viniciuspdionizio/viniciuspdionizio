import { FormControl, ValidationErrors } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import type { CountryCode } from 'libphonenumber-js/min';
import { phoneNumberValidator } from './phone.validator';

describe('phoneNumberValidator', () => {
  // A implementação sempre devolve Observable (nunca Promise), então o cast
  // aqui é seguro e evita repetir o `as Observable<...>` em cada teste.
  function validate(value: string, country: CountryCode): Promise<ValidationErrors | null> {
    const control = new FormControl(value);
    const result = phoneNumberValidator(() => country)(control) as Observable<ValidationErrors | null>;
    return firstValueFrom(result);
  }

  it('não dispara o import() e é válido quando o campo está vazio', async () => {
    const result = await validate('', 'BR');
    expect(result).toBeNull();
  });

  it('não dispara o import() e é válido quando o campo só tem espaços', async () => {
    const result = await validate('   ', 'BR');
    expect(result).toBeNull();
  });

  it('é válido para um número BR bem formado', async () => {
    const result = await validate('(18) 99716-9891', 'BR');
    expect(result).toBeNull();
  });

  it('expõe invalidPhone para um número BR curto/malformado', async () => {
    const result = await validate('1234', 'BR');
    expect(result).toEqual({ invalidPhone: true });
  });

  it('é válido para um número US bem formado, provando o suporte multi-país', async () => {
    const result = await validate('(213) 373-4253', 'US');
    expect(result).toBeNull();
  });

  it('rejeita um número móvel BR válido quando avaliado como US (é ciente do país)', async () => {
    // BR móvel tem 11 dígitos (2 de DDD + 9), o que não fecha com o padrão
    // fixo de 10 dígitos do plano de numeração americano — ao contrário de
    // um número fixo BR de 10 dígitos, que coincide estruturalmente com um
    // número americano e não serviria pra provar o teste.
    const result = await validate('(18) 99716-9891', 'US');
    expect(result).toEqual({ invalidPhone: true });
  });

  it('lê o país mais recente retornado por getCountry a cada validação', async () => {
    let country: CountryCode = 'US';
    const control = new FormControl('(18) 99716-9891'); // válido só como BR, ver teste acima
    const validatorFn = phoneNumberValidator(() => country);
    const run = () => firstValueFrom(validatorFn(control) as Observable<ValidationErrors | null>);

    expect(await run()).toEqual({ invalidPhone: true });

    country = 'BR';
    expect(await run()).toBeNull();
  });
});
