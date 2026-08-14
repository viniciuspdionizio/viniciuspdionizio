import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { CountryCode } from 'libphonenumber-js/min';
import { COUNTRIES } from '../../data/countries';

/**
 * Seletor de país/DDI (FR1). `<select>` HTML nativo estilizado com Tailwind
 * — não um combobox customizado: acessibilidade de teclado (incluindo busca
 * por digitação, útil com ~200 países) vem de graça do elemento nativo, e
 * ele renderiza igual em SSR (NFR2), sem precisar reimplementar semântica
 * ARIA de listbox (NFR4).
 */
@Component({
  selector: 'app-country-select',
  templateUrl: './country-select.component.html',
})
export class CountrySelectComponent {
  @Input() id = 'phone-country';
  @Input() value: CountryCode = 'BR';
  @Output() valueChange = new EventEmitter<CountryCode>();

  readonly countries = COUNTRIES;

  onChange(target: EventTarget | null): void {
    const select = target as HTMLSelectElement;
    this.valueChange.emit(select.value as CountryCode);
  }
}
