import { Component, ChangeDetectionStrategy, afterNextRender, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { SeoService } from './services/seo.service';
import { TrackingService } from './services/tracking.service';

@Component({
    selector: 'app-root',
    imports: [RouterModule, NgxSonnerToaster],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor() {
    // Roda também durante o prerender (SSR), então o HTML estático de cada
    // idioma já sai com <title>/meta/hreflang corretos (ver SeoService).
    inject(SeoService).apply();

    // afterNextRender só executa no browser (nunca durante o SSR/prerender),
    // então a visita só é registrada quando alguém realmente abre a página.
    const tracking = inject(TrackingService);
    afterNextRender(() => tracking.trackVisit());
  }
}
