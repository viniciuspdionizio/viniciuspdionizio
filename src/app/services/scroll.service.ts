import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Centraliza a navegação por âncoras (scroll suave até uma seção da página).
 * Usa o token DOCUMENT em vez do global `document` para permanecer seguro em SSR.
 */
@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private readonly document = inject(DOCUMENT);

  scrollToSection(event: Event, targetId: string): void {
    event.preventDefault();

    const targetElement = this.document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
