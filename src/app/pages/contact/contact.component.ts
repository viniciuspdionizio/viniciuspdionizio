import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ContactService } from '../../services/contact.service';

@Component({
    selector: 'app-contact',
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.sass'
})
export default class ContactComponent {
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);


  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', []],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  isSubmitting = signal(false);
  submitSuccess = signal(false);

  socials = [
    { name: 'LinkedIn', icon: 'bi bi-linkedin', url: 'https://linkedin.com/in/viniciuspdionizio', color: 'hover:text-[#0a66c2] hover:border-[#0a66c2]/40' },
    { name: 'GitHub', icon: 'bi bi-github', url: 'https://github.com/viniciuspdionizio', color: 'hover:text-[#f0f6fc] hover:border-[#f0f6fc]/40' },
    { name: 'WhatsApp', icon: 'bi bi-whatsapp', url: 'https://wa.me/+5518997169891', color: 'hover:text-[#25d366] hover:border-[#25d366]/40' },
    { name: 'Instagram', icon: 'bi bi-instagram', url: 'https://instagram.com/viniciuspdionizio', color: 'hover:text-[#e1306c] hover:border-[#e1306c]/40' }
  ];

  send() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);

    this.contactService.sendEmail(this.form.getRawValue())
      .pipe(finalize(() => {
        this.form.reset();
        this.isSubmitting.set(false);
      }))
      .subscribe({
        next: () => this.submitSuccess.set(true),
        error: () => {
          this.submitSuccess.set(false);
        }

      });

  }
}
