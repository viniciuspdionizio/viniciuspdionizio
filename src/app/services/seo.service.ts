import { DOCUMENT } from '@angular/common';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_ORIGIN = 'https://viniciuspdionizio.netlify.app';

interface LocaleSeo {
  /** Segmento de URL do idioma (vazio para o idioma-fonte, que fica na raiz). */
  path: string;
  ogLocale: string;
  title: string;
  description: string;
  ogDescription: string;
  twitterDescription: string;
  keywords: string;
}

const SEO_BY_LOCALE: Record<string, LocaleSeo> = {
  'pt-BR': {
    path: '',
    ogLocale: 'pt_BR',
    title: 'Vinicius Dionizio | Desenvolvedor Full-stack',
    description: 'Portfólio de Vinicius de Paiva Dionizio, desenvolvedor front-end focado em Angular, TypeScript e Tailwind CSS. Conheça meus projetos, habilidades e trajetória.',
    ogDescription: 'Portfólio pessoal e de projetos em desenvolvimento full-stack com Angular, unindo disciplina de atleta com engenharia de software.',
    twitterDescription: 'Portfólio pessoal e de projetos em desenvolvimento front-end com Angular.',
    keywords: 'Vinicius Dionizio, Vinicius de Paiva Dionizio, Desenvolvedor Full-stack, Angular, TypeScript, Tailwind CSS, Portfólio Dev, Lupum, Java, Spring, Hibernate, Postgres',
  },
  'en-US': {
    path: 'en/',
    ogLocale: 'en_US',
    title: 'Vinicius Dionizio | Full-Stack Developer',
    description: 'Portfolio of Vinicius de Paiva Dionizio, a front-end developer focused on Angular, TypeScript and Tailwind CSS. Check out my projects, skills and background.',
    ogDescription: 'Personal and project portfolio in full-stack development with Angular, combining an athlete’s discipline with software engineering.',
    twitterDescription: 'Personal and project portfolio in front-end development with Angular.',
    keywords: 'Vinicius Dionizio, Vinicius de Paiva Dionizio, Full-Stack Developer, Angular, TypeScript, Tailwind CSS, Dev Portfolio, Lupum, Java, Spring, Hibernate, Postgres',
  },
};

/**
 * Ajusta &lt;title&gt;, meta tags e links de idioma (canonical + hreflang) de
 * acordo com o LOCALE_ID da build atual (ver "i18n" em angular.json).
 *
 * Roda no construtor do AppComponent, então também executa durante o
 * prerender (SSR) — o HTML estático gerado por locale já sai com a tag
 * correta, sem depender de JS no cliente (bom para SEO/crawlers).
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly locale = inject(LOCALE_ID);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(): void {
    const seo = SEO_BY_LOCALE[this.locale] ?? SEO_BY_LOCALE['pt-BR'];
    const url = `${SITE_ORIGIN}/${seo.path}`;

    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'keywords', content: seo.keywords });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.ogDescription });
    this.meta.updateTag({ property: 'og:locale', content: seo.ogLocale });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'twitter:title', content: seo.title });
    this.meta.updateTag({ property: 'twitter:description', content: seo.twitterDescription });

    this.upsertLink('canonical', url);
    for (const [locale, localeSeo] of Object.entries(SEO_BY_LOCALE)) {
      this.upsertLink('alternate', `${SITE_ORIGIN}/${localeSeo.path}`, locale);
    }
    // "x-default": para onde mandar quem não bate com nenhum hreflang acima
    // (ex: buscador configurado num idioma que não oferecemos) — aponta para
    // o idioma-fonte, na raiz.
    this.upsertLink('alternate', `${SITE_ORIGIN}/`, 'x-default');
  }

  private upsertLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) link.setAttribute('hreflang', hreflang);
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
