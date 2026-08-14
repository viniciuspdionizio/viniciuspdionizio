import { Directive, ElementRef, HostListener, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';
import type { CountryCode } from 'libphonenumber-js/min';
import { loadPhoneLib } from '../utils/phone-lib-loader';

/**
 * Formata o campo de telefone "as-you-type" (FR2) conforme o país
 * selecionado (`@Input() country`), preservando a posição do cursor.
 *
 * Só reage a eventos reais de `input` do usuário ou a mudanças do próprio
 * `@Input() country` — nunca escreve no DOM por conta própria em nenhum
 * outro momento, então não há nada a formatar durante o prerender (NFR2):
 * o campo começa vazio e permanece vazio até o usuário digitar algo.
 */
@Directive({
  selector: '[appPhoneMask]',
})
export class PhoneMaskDirective implements OnChanges {
  @Input() country: CountryCode = 'BR';

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly el = inject(ElementRef<HTMLInputElement>);

  @HostListener('input', ['$event'])
  async onInput(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value;
    const caret = input.selectionStart ?? rawValue.length;
    const digitsBeforeCaret = countDigits(rawValue.slice(0, caret));

    const { AsYouType } = await loadPhoneLib();

    // Se o valor mudou de novo enquanto a lib carregava (digitação rápida
    // entre o primeiro uso e o import() resolver), um novo evento 'input'
    // já disparou e vai formatar a versão mais recente — não sobrescrever
    // com um resultado calculado em cima de um valor velho.
    if (input.value !== rawValue) return;

    this.applyFormatted(new AsYouType(this.country).input(rawValue), digitsBeforeCaret);
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    // Troca de país depois que algo já foi digitado: reformata o valor
    // atual nas regras do novo país. No primeiro binding (inicialização do
    // input) não há nada pra reformatar ainda.
    if (changes['country']?.firstChange) return;

    const currentValue = String(this.ngControl?.control?.value ?? this.el.nativeElement.value ?? '');
    if (!currentValue) return;

    const caret = this.el.nativeElement.selectionStart ?? currentValue.length;
    const digitsBeforeCaret = countDigits(currentValue.slice(0, caret));

    const { AsYouType } = await loadPhoneLib();
    this.applyFormatted(new AsYouType(this.country).input(currentValue), digitsBeforeCaret);
  }

  private applyFormatted(formatted: string, digitsBeforeCaret: number): void {
    // Passa pelo FormControl (quando existe) para que view e model fiquem
    // sincronizados e os validators rodem de novo com o valor formatado;
    // sem controle associado (ex: uso fora de Reactive Forms), escreve
    // direto no elemento.
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(formatted);
    } else {
      this.el.nativeElement.value = formatted;
    }

    const caretIndex = caretIndexForDigitCount(formatted, digitsBeforeCaret);
    this.el.nativeElement.setSelectionRange(caretIndex, caretIndex);
  }
}

function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

/**
 * Acha, dentro do texto já formatado, o índice logo após o N-ésimo dígito —
 * é assim que a posição do cursor "acompanha" os dígitos que o usuário
 * digitou, e não um índice fixo de caractere (que mudaria de sentido a cada
 * separador inserido/removido pela formatação).
 */
function caretIndexForDigitCount(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return 0;

  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen === digitCount) return i + 1;
    }
  }
  return formatted.length;
}
