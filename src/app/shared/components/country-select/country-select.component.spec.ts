import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountrySelectComponent } from './country-select.component';
import { COUNTRIES } from '../../data/countries';

describe('CountrySelectComponent', () => {
  let fixture: ComponentFixture<CountrySelectComponent>;
  let component: CountrySelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CountrySelectComponent] }).compileComponents();
    fixture = TestBed.createComponent(CountrySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renderiza uma <option> para cada país da lista', () => {
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(COUNTRIES.length);
  });

  it('mostra a bandeira, o nome do país e o DDI em cada opção', () => {
    const first = COUNTRIES[0];
    const options: HTMLOptionElement[] = Array.from(fixture.nativeElement.querySelectorAll('option'));
    const match = options.find((o) => o.value === first.iso2);
    expect(match?.textContent?.trim()).toBe(`${first.flag} ${first.name} (+${first.dialCode})`);
  });

  it('reflete o @Input() value como opção selecionada', () => {
    component.value = 'US';
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.value).toBe('US');
  });

  it('emite valueChange com o novo iso2 quando o usuário troca a opção', () => {
    const emitted: string[] = [];
    component.valueChange.subscribe((v) => emitted.push(v));

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'PT';
    select.dispatchEvent(new Event('change'));

    expect(emitted).toEqual(['PT']);
  });

  it('associa o <select> a um <label> acessível via id', () => {
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(label.getAttribute('for')).toBe(select.id);
  });
});
