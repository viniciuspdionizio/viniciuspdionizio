import { Component, HostListener, inject, LOCALE_ID, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private readonly scrollService = inject(ScrollService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly locale = inject(LOCALE_ID);
  private readonly document = inject(DOCUMENT);

  isMenuOpen = false;
  isScrolled = false;

  // Só dois idiomas por enquanto (ver "i18n" em angular.json), então um
  // toggle simples resolve — não precisa de um seletor com lista.
  readonly otherLocale = this.locale === 'en-US' ? 'pt-BR' : 'en-US';
  readonly otherLocaleShortLabel = this.otherLocale === 'en-US' ? 'EN' : 'PT';
  readonly switchLanguageLabel = this.otherLocale === 'en-US'
    ? $localize`:@@header.switchToEnglish:Switch to English`
    : $localize`:@@header.switchToPortuguese:Mudar para português`;

  // Mesmas chaves (@@nav.*) usadas nos links estáticos do footer
  // (footer.component.html), para reaproveitar a mesma tradução.
  navLinks = [
    { label: $localize`:@@nav.home:Início`, href: '#home' },
    { label: $localize`:@@nav.about:Sobre Mim`, href: '#about' },
    { label: $localize`:@@nav.skills:Habilidades`, href: '#skills' },
    { label: $localize`:@@nav.experience:Experiência`, href: '#experience' },
    { label: $localize`:@@nav.contact:Contato`, href: '#contact' }
  ];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;
    }
  }

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

  /**
   * URL da mesma página no outro idioma. Cada idioma é uma build estática
   * própria servida numa subpasta (ver "i18n" em angular.json e
   * netlify.toml) — então trocar de idioma é navegação normal (full page
   * load), não algo que o router do Angular resolve.
   *
   * Calculado a partir do atributo href de <base>, que já reflete o deploy
   * atual (raiz no Netlify, "/viniciuspdionizio/" no GitHub Pages) — funciona
   * nos dois sem hardcode. Lê o atributo bruto (não `document.baseURI`, que
   * o DOM do prerender/SSR — domino — não implementa).
   */
  get otherLocaleHref(): string {
    const base = this.document.querySelector('base')?.getAttribute('href') ?? '/';
    const root = this.locale === 'en-US' ? base.replace(/en\/$/, '') : base;
    const target = this.otherLocale === 'en-US' ? `${root}en/` : root;
    // Preserva a seção atual (ex: #skills) ao trocar de idioma — só existe
    // no browser, nunca durante SSR/prerender.
    const hash = isPlatformBrowser(this.platformId) ? window.location.hash : '';
    return `${target}${hash}`;
  }
}
