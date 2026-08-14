import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly scrollService = inject(ScrollService);

  isMenuOpen = false;
  isScrolled = false;

  navLinks = [
    { label: 'Início', href: '#home' },
    { label: 'Sobre Mim', href: '#about' },
    { label: 'Habilidades', href: '#skills' },
    { label: 'Experiência', href: '#experience' },
    { label: 'Contato', href: '#contact' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(event: Event, targetId: string) {
    this.isMenuOpen = false;
    this.scrollService.scrollToSection(event, targetId);
  }
}
