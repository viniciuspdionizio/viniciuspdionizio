import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';

import ContactComponent from './contact.component';
import { ContactService } from '../../services/contact.service';

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

  beforeEach(async () => {
    contactServiceSpy = jasmine.createSpyObj('ContactService', ['sendEmail']);

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [{ provide: ContactService, useValue: contactServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

    it('should require message with at least 10 characters', () => {
      const control = component.form.controls.message;
      control.setValue('curta');
      expect(control.hasError('minlength')).toBeTrue();
      control.setValue('Mensagem longa o suficiente.');
      expect(control.valid).toBeTrue();
    });
  });

  describe('send()', () => {
    it('should not call the service and should mark all fields as touched when the form is invalid', () => {
      component.send();

      expect(contactServiceSpy.sendEmail).not.toHaveBeenCalled();
      expect(component.form.controls.name.touched).toBeTrue();
      expect(component.form.controls.email.touched).toBeTrue();
      expect(component.form.controls.message.touched).toBeTrue();
    });

    it('should send the raw form value (including the empty honeypot) on success', () => {
      component.form.setValue({ ...validValues, website: '' });
      contactServiceSpy.sendEmail.and.returnValue(of({ statusCode: 200, body: { success: true } }));
      spyOn(toast, 'success');

      component.send();

      expect(contactServiceSpy.sendEmail).toHaveBeenCalledWith({ ...validValues, website: '' });
      expect(toast.success).toHaveBeenCalled();
      expect(component.submitSuccess()).toBeTrue();
      expect(component.isSubmitting()).toBeFalse();
    });

    it('should reset the form after a successful submission', () => {
      component.form.setValue({ ...validValues, website: '' });
      contactServiceSpy.sendEmail.and.returnValue(of({ statusCode: 200, body: { success: true } }));

      component.send();

      expect(component.form.controls.name.value).toBe('');
      expect(component.form.controls.email.value).toBe('');
    });

    it('should set isSubmitting while the request is in flight', fakeAsync(() => {
      component.form.setValue({ ...validValues, website: '' });
      contactServiceSpy.sendEmail.and.returnValue(of({ statusCode: 200, body: { success: true } }).pipe());

      component.send();
      flush();

      expect(component.isSubmitting()).toBeFalse();
    }));

    it('should show a generic error toast and open the mailto fallback on a plain error', () => {
      component.form.setValue({ ...validValues, website: '' });
      contactServiceSpy.sendEmail.and.returnValue(throwError(() => new Error('boom')));
      spyOn(toast, 'error');
      spyOn(window, 'open');

      component.send();

      expect(toast.error).toHaveBeenCalledWith('Erro ao enviar e-mail', { description: 'Erro interno do servidor' });
      expect(component.submitSuccess()).toBeFalse();
      expect(component.isSubmitting()).toBeFalse();
      expect(window.open).toHaveBeenCalled();
      const [url] = (window.open as jasmine.Spy).calls.mostRecent().args;
      expect(url).toContain('mailto:dev.viniciuspd@gmail.com');
      expect(url).toContain(encodeURIComponent(validValues.name));
    });

    it('should show the server-provided error description when available', () => {
      component.form.setValue({ ...validValues, website: '' });
      const httpError = new HttpErrorResponse({
        error: { error: 'Falha ao enviar' },
        status: 500,
        statusText: 'Server Error',
      });
      contactServiceSpy.sendEmail.and.returnValue(throwError(() => httpError));
      spyOn(toast, 'error');
      spyOn(window, 'open');

      component.send();

      expect(toast.error).toHaveBeenCalledWith('Erro ao enviar e-mail', { description: 'Falha ao enviar' });
    });
  });
});
