import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';

import ContactComponent from './contact.component';
import { ContactService } from '../../services/contact.service';

const STORAGE_KEY = 'contact:phone-country';

/**
 * O validador de telefone é assíncrono por causa de um import() dinâmico
 * real (ver shared/utils/phone-lib-loader.ts) — não dá pra "flushar" isso de
 * forma síncrona com fakeAsync/tick (não é um timer, é um carregamento de
 * chunk). Por isso esperamos de verdade o status do controle sair de
 * PENDING, em vez de simular o tempo.
 */
async function waitUntilValidated(control: AbstractControl, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (control.status === 'PENDING' && Date.now() - start < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let contactServiceSpy: jasmine.SpyObj<ContactService>;

  const validValues = {
    name: 'João Silva',
    email: 'joao@teste.com',
    phone: '(18) 99999-9999',
    message: 'Olá, gostaria de conversar sobre um projeto.',
  };
  const validPhoneE164 = '+5518999999999';

  beforeEach(async () => {
    localStorage.removeItem(STORAGE_KEY);
    contactServiceSpy = jasmine.createSpyObj('ContactService', ['sendEmail']);

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [{ provide: ContactService, useValue: contactServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an invalid, untouched form', () => {
    expect(component.form.valid).toBeFalse();
    expect(component.form.controls.name.touched).toBeFalse();
  });

  it('should include a honeypot control that is empty by default', () => {
    expect(component.form.controls.website).toBeDefined();
    expect(component.form.getRawValue().website).toBe('');
  });

  it('should default the selected country to BR when there is no stored preference', () => {
    expect(component.selectedCountry()).toBe('BR');
  });

  describe('validation', () => {
    it('should require name with at least 3 characters', () => {
      const control = component.form.controls.name;
      control.setValue('ab');
      expect(control.hasError('minlength')).toBeTrue();
      control.setValue('');
      expect(control.hasError('required')).toBeTrue();
      control.setValue('Ana');
      expect(control.valid).toBeTrue();
    });

    it('should require a valid email', () => {
      const control = component.form.controls.email;
      control.setValue('not-an-email');
      expect(control.hasError('email')).toBeTrue();
      control.setValue('ana@teste.com');
      expect(control.valid).toBeTrue();
    });

    it('should not require phone', () => {
      expect(component.form.controls.phone.valid).toBeTrue();
    });

    it('should validate phone format when filled in (BR, país default)', async () => {
      const control = component.form.controls.phone;

      control.setValue('abc123');
      await waitUntilValidated(control);
      expect(control.hasError('invalidPhone')).toBeTrue();

      control.setValue('1234');
      await waitUntilValidated(control);
      expect(control.hasError('invalidPhone')).toBeTrue();

      control.setValue('(18) 99999-9999');
      await waitUntilValidated(control);
      expect(control.valid).toBeTrue();
    });

    it('should validate phone as US when the US country is selected, proving multi-country support', async () => {
      const control = component.form.controls.phone;
      component.onCountryChange('US');

      // Número BR móvel válido, mas estruturalmente inválido como US
      // (11 dígitos não fecha com o padrão fixo de 10 dígitos do NANP).
      control.setValue('(18) 99999-9999');
      await waitUntilValidated(control);
      expect(control.hasError('invalidPhone')).toBeTrue();

      control.setValue('(213) 373-4253');
      await waitUntilValidated(control);
      expect(control.valid).toBeTrue();
    });

    it('should require message with at least 10 characters', () => {
      const control = component.form.controls.message;
      control.setValue('curta');
      expect(control.hasError('minlength')).toBeTrue();
      control.setValue('Mensagem longa o suficiente.');
      expect(control.valid).toBeTrue();
    });
  });

  describe('onCountryChange()', () => {
    it('updates the selected country signal', () => {
      component.onCountryChange('PT');
      expect(component.selectedCountry()).toBe('PT');
    });

    it('persists the preference to localStorage', () => {
      component.onCountryChange('PT');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('PT');
    });
  });

  describe('country persistence on init', () => {
    it('restores a previously saved country preference on a new visit', () => {
      localStorage.setItem(STORAGE_KEY, 'US');

      const returningFixture = TestBed.createComponent(ContactComponent);
      const returningComponent = returningFixture.componentInstance;

      expect(returningComponent.selectedCountry()).toBe('US');
    });
  });

  describe('send()', () => {
    async function fillValidFormAndWait(): Promise<void> {
      component.form.setValue({ ...validValues, website: '' });
      await waitUntilValidated(component.form.controls.phone);
    }

    it('should not call the service and should mark all fields as touched when the form is invalid', () => {
      component.send();

      expect(contactServiceSpy.sendEmail).not.toHaveBeenCalled();
      expect(component.form.controls.name.touched).toBeTrue();
      expect(component.form.controls.email.touched).toBeTrue();
      expect(component.form.controls.message.touched).toBeTrue();
    });

    it('should send the raw form value with the phone normalized to E.164 on success', async () => {
      await fillValidFormAndWait();
      contactServiceSpy.sendEmail.and.returnValue(of({ statusCode: 200, body: { success: true } }));
      spyOn(toast, 'success');

      await component.send();

      expect(contactServiceSpy.sendEmail).toHaveBeenCalledWith({ ...validValues, phone: validPhoneE164, website: '' });
      expect(toast.success).toHaveBeenCalled();
      expect(component.submitSuccess()).toBeTrue();
      expect(component.isSubmitting()).toBeFalse();
    });

    it('should send an empty phone unchanged when the field is left blank', async () => {
      component.form.setValue({ ...validValues, phone: '', website: '' });
      await waitUntilValidated(component.form.controls.phone);
      contactServiceSpy.sendEmail.and.returnValue(of({ statusCode: 200, body: { success: true } }));

      await component.send();

      expect(contactServiceSpy.sendEmail).toHaveBeenCalledWith({ ...validValues, phone: '', website: '' });
    });

    it('should reset the form after a successful submission', async () => {
      await fillValidFormAndWait();
      contactServiceSpy.sendEmail.and.returnValue(of({ statusCode: 200, body: { success: true } }));

      await component.send();

      expect(component.form.controls.name.value).toBe('');
      expect(component.form.controls.email.value).toBe('');
    });

    it('should set isSubmitting while the request is in flight', async () => {
      await fillValidFormAndWait();
      contactServiceSpy.sendEmail.and.returnValue(of({ statusCode: 200, body: { success: true } }).pipe());

      await component.send();

      expect(component.isSubmitting()).toBeFalse();
    });

    it('should show a generic error toast and open the mailto fallback (with country + national format) on a plain error', async () => {
      await fillValidFormAndWait();
      contactServiceSpy.sendEmail.and.returnValue(throwError(() => new Error('boom')));
      spyOn(toast, 'error');
      spyOn(window, 'open');

      await component.send();

      expect(toast.error).toHaveBeenCalledWith('Erro ao enviar e-mail', { description: 'Erro interno do servidor' });
      expect(component.submitSuccess()).toBeFalse();
      expect(component.isSubmitting()).toBeFalse();
      expect(window.open).toHaveBeenCalled();
      const [url] = (window.open as jasmine.Spy).calls.mostRecent().args;
      expect(url).toContain('mailto:dev.viniciuspd@gmail.com');
      expect(url).toContain(encodeURIComponent(validValues.name));
      // Fallback precisa continuar legível para humano (país + formato
      // nacional), não em E.164 cru (FR8/AC7).
      expect(url).toContain(encodeURIComponent(`Brasil (+55): ${validValues.phone}`));
      expect(url).not.toContain(encodeURIComponent(validPhoneE164));
    });

    it('should show the server-provided error description when available', async () => {
      await fillValidFormAndWait();
      const httpError = new HttpErrorResponse({
        error: { error: 'Falha ao enviar' },
        status: 500,
        statusText: 'Server Error',
      });
      contactServiceSpy.sendEmail.and.returnValue(throwError(() => httpError));
      spyOn(toast, 'error');
      spyOn(window, 'open');

      await component.send();

      expect(toast.error).toHaveBeenCalledWith('Erro ao enviar e-mail', { description: 'Falha ao enviar' });
    });
  });
});
