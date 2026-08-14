import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { CountryCode } from 'libphonenumber-js/min';
import { PhoneMaskDirective } from './phone-mask.directive';

@Component({
  imports: [ReactiveFormsModule, PhoneMaskDirective],
  template: `<input [formControl]="control" appPhoneMask [country]="country">`,
})
class TestHostComponent {
  control = new FormControl('');
  country: CountryCode = 'BR';
}

/**
 * A formatação depende de um import() dinâmico real (chunk separado, ver
 * phone-lib-loader.ts) — não é algo que dê pra "flushar" de forma síncrona
 * com fakeAsync/tick. Por isso os testes esperam de verdade (polling) o
 * valor do input mudar, em vez de simular o tempo.
 */
async function waitUntil(condition: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (!condition() && Date.now() - start < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

function setInputValue(input: HTMLInputElement, value: string, caret: number = value.length): void {
  input.value = value;
  input.selectionStart = caret;
  input.selectionEnd = caret;
  input.dispatchEvent(new Event('input'));
}

describe('PhoneMaskDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let input: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('formata um número BR conforme o usuário digita', async () => {
    setInputValue(input, '18997169891');
    await waitUntil(() => input.value === '(18) 99716-9891');

    expect(input.value).toBe('(18) 99716-9891');
    expect(host.control.value).toBe('(18) 99716-9891');
  });

  it('formata um número US conforme as regras do país selecionado', async () => {
    host.country = 'US';
    fixture.detectChanges();

    setInputValue(input, '2133734253');
    await waitUntil(() => input.value === '(213) 373-4253');

    expect(input.value).toBe('(213) 373-4253');
  });

  it('mantém o cursor logo após o último dígito digitado, não no fim do texto', async () => {
    // Digita "1899716" com o cursor no fim (7 dígitos) — a formatação insere
    // separadores antes do cursor; ele deve acompanhar os dígitos, não ficar
    // fixo no índice de caractere nem pular pro fim do texto formatado.
    setInputValue(input, '1899716', 7);
    await waitUntil(() => input.value === '(18) 99716');

    expect(input.value).toBe('(18) 99716');
    expect(input.selectionStart).toBe('(18) 99716'.length); // aqui coincide com o fim
  });

  it('mantém o cursor no meio do número ao inserir um dígito no meio', async () => {
    // Valor já formatado "(18) 9971-9891" (propositalmente com 1 dígito a
    // menos no bloco do meio) e o usuário insere um "6" logo depois do "9971"
    // pra completar "99716" — cursor deve ficar logo após o "6" no resultado
    // formatado, não no fim da string.
    setInputValue(input, '(18) 997169891', 9); // "18" + "997169891", cursor após "9971" -> 6 dígitos antes
    await waitUntil(() => input.value === '(18) 99716-9891');

    expect(input.value).toBe('(18) 99716-9891');
    // 6 dígitos antes do cursor original ("189971") -> cursor deve ficar
    // logo após o 6º dígito no texto formatado: "(18) 9971|6-9891".
    expect(input.selectionStart).toBe('(18) 9971'.length);
  });

  it('reformata o valor já digitado quando o país muda', async () => {
    setInputValue(input, '18997169891');
    await waitUntil(() => input.value === '(18) 99716-9891');

    host.country = 'PT';
    fixture.detectChanges();
    await waitUntil(() => input.value !== '(18) 99716-9891');

    expect(input.value).not.toBe('(18) 99716-9891');
    expect(input.value.replace(/\D/g, '')).toBe('18997169891');
  });

  it('não reformata nada na inicialização (campo vazio, sem escrita fora de evento)', () => {
    expect(input.value).toBe('');
    expect(host.control.value).toBe('');
  });
});
