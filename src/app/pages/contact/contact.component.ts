import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, LOCALE_ID, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { CountryCode } from 'libphonenumber-js/min';
import { toast } from 'ngx-sonner';
import { finalize } from 'rxjs';
import { socials } from '../../components/utils/socials';
import { ContactService } from '../../services/contact.service';
import { CountrySelectComponent } from '../../shared/components/country-select/country-select.component';
import { COUNTRIES } from '../../shared/data/countries';
import { PhoneMaskDirective } from '../../shared/directives/phone-mask.directive';
import { localizedCountryName } from '../../shared/utils/localized-country-name';
import { loadPhoneLib } from '../../shared/utils/phone-lib-loader';
import { readStoredCountry, writeStoredCountry } from '../../shared/utils/phone-country-storage';
import { phoneNumberValidator } from '../../shared/validators/phone.validator';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CountrySelectComponent,
    PhoneMaskDirective,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export default class ContactComponent {
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);
  private readonly locale = inject(LOCALE_ID);

  socials = socials;

  // Só é lido/escrito em contexto de browser — nunca durante SSR/prerender
  // (NFR2). O valor persistido (se houver) só aplica após a hydration.
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  selectedCountry = signal<CountryCode>(readStoredCountry(this.isBrowser) ?? 'BR');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    // Opcional, mas se preenchido precisa ser um telefone estruturalmente
    // válido para o país selecionado (validador assíncrono, ver
    // shared/validators/phone.validator.ts — a mesma metadata de telefone é
    // revalidada no backend, ver netlify/functions/send-email.ts).
    phone: ['', [], [phoneNumberValidator(() => this.selectedCountry())]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    // Honeypot anti-spam: campo invisível para humanos (ver contact.component.html).
    // Se vier preenchido, o backend descarta o envio silenciosamente.
    website: ['', []],
  });

  isSubmitting = signal(false);
  submitSuccess = signal(false);

  onCountryChange(country: CountryCode): void {
    this.selectedCountry.set(country);
    writeStoredCountry(this.isBrowser, country);
  }

  async send() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);

    const rawValue = this.form.getRawValue();
    // Valor "bonito" exibido no campo (ex: "(18) 99716-9891") — preservado
    // à parte para o fallback de mailto: (FR8), que precisa continuar
    // legível para humano, não em E.164 cru.
    const displayPhone = rawValue.phone;
    const phoneE164 = await this.toE164(displayPhone);

    this.contactService.sendEmail({ ...rawValue, phone: phoneE164 })
      .pipe(finalize(() => {
        this.isSubmitting.set(false);
      }))
      .subscribe({
        next: () => {
          toast.success($localize`:@@contact.toast.success:Email enviado com sucesso`);
          this.submitSuccess.set(true);
          this.form.reset();
        },
        error: error => {
          console.error('Erro ao enviar email', { error });
          this.submitSuccess.set(false);
          const genericError = $localize`:@@contact.toast.error.generic:Erro interno do servidor`;
          if (error instanceof HttpErrorResponse) {
            toast.error($localize`:@@contact.toast.error.title:Erro ao enviar e-mail`, { description: error.error?.error || genericError });
          } else {
            toast.error($localize`:@@contact.toast.error.title:Erro ao enviar e-mail`, { description: genericError });
          }
          const subject = encodeURIComponent($localize`:@@contact.mailto.subject:Contato`);
          const nameLabel = $localize`:@@contact.mailto.name:Nome`;
          const phoneLabel = $localize`:@@contact.mailto.phone:Telefone`;
          const messageLabel = $localize`:@@contact.mailto.message:Mensagem`;
          const body = encodeURIComponent(`${nameLabel}: ${rawValue.name}\nEmail: ${rawValue.email}\n${phoneLabel}: ${this.formatPhoneForMailto(displayPhone)}\n${messageLabel}: ${rawValue.message}`);
          const mailtoUrl = `mailto:dev.viniciuspd@gmail.com?subject=${subject}&body=${body}`;
          window.open(mailtoUrl, '_blank', 'noopener,noreferrer');
        }

      });

  }

  /** Converte o valor exibido no campo (formato nacional) para E.164 (FR5). */
  private async toE164(displayPhone: string): Promise<string> {
    if (!displayPhone) return '';
    const { parsePhoneNumberFromString } = await loadPhoneLib();
    const parsed = parsePhoneNumberFromString(displayPhone, this.selectedCountry());
    return parsed?.number ?? displayPhone;
  }

  /** Monta "Nome do país (+DDI): número" para o corpo do mailto: (FR8). */
  private formatPhoneForMailto(displayPhone: string): string {
    if (!displayPhone) return '';
    const country = COUNTRIES.find(c => c.iso2 === this.selectedCountry());
    if (!country) return displayPhone;
    return `${localizedCountryName(country, this.locale)} (+${country.dialCode}): ${displayPhone}`;
  }
}
