import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { socials } from '../utils/socials';

@Component({
    selector: 'app-footer',
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socials = socials;

  scrollToSection(event: Event, targetId: string) {
    event.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
