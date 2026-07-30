
import { Component } from '@angular/core';
import { versionInfo } from '../../version-info';
import { socials } from '../utils/socials';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-footer',
  imports: [DatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly versionInfo = versionInfo;
  currentYear = new Date().getFullYear();

  ngOnInit() {
    console.log('Version Info:', this.versionInfo);
  }

  socials = socials;

  scrollToSection(event: Event, targetId: string) {
    event.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
