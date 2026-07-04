import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { finalize } from 'rxjs';
import { socials } from '../../components/utils/socials';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export default class ContactComponent {
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);

  socials = socials;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', []],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  isSubmitting = signal(false);
  submitSuccess = signal(false);

  send() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);

    this.contactService.sendEmail(this.form.getRawValue())
      .pipe(finalize(() => {
        this.isSubmitting.set(false);
      }))
      .subscribe({
        next: () => {
          toast.success('Email enviado com sucesso');
          this.submitSuccess.set(true);
          this.form.reset();
        },
        error: error => {
          console.error('Erro ao enviar email', { error });
          this.submitSuccess.set(false);
          if (error instanceof HttpErrorResponse) {
            toast.error('Erro ao enviar e-mail', { description: error.error?.error || 'Erro interno do servidor' });
          } else {
            toast.error('Erro ao enviar e-mail', { description: 'Erro interno do servidor' });
          }
          const subject = encodeURIComponent('Contato');
          const body = encodeURIComponent(`Nome: ${this.form.get('name')?.value || ''}\nEmail: ${this.form.get('email')?.value || ''}\nTelefone: ${this.form.get('phone')?.value || ''}\nMensagem: ${this.form.get('message')?.value || ''}`);
          const mailtoUrl = `mailto:dev.viniciuspd@gmail.com?subject=${subject}&body=${body}`;
          window.open(mailtoUrl, '_blank', 'noopener,noreferrer');
        }

      });

  }
}
