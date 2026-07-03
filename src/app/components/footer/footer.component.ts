import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socials = [
    { name: 'GitHub', icon: 'bi bi-github', url: 'https://github.com/viniciuspdionizio' },
    { name: 'LinkedIn', icon: 'bi bi-linkedin', url: 'https://linkedin.com/in/viniciuspdionizio' },
    { name: 'WhatsApp', icon: 'bi bi-whatsapp', url: 'https://wa.me/+5518997169891' },
    { name: 'Instagram', icon: 'bi bi-instagram', url: 'https://instagram.com/viniciuspdionizio' }
  ];

  scrollToSection(event: Event, targetId: string) {
    event.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
