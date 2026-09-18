import { HttpClient } from '@angular/common/http';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private readonly apiUrl = environment.netlifyHostUrl;
  private readonly http = inject(HttpClient);
  private readonly locale = inject(LOCALE_ID);

  /**
   * Fire-and-forget: chamado só no browser (ver AppComponent), nunca deve
   * atrapalhar ou atrasar a navegação do visitante.
   */
  trackVisit(): void {
    this.http
      .post(`${this.apiUrl}/.netlify/functions/track-visit`, {
        path: window.location.pathname,
        referrer: document.referrer || null,
        locale: this.locale,
      })
      .subscribe({ error: () => undefined });
  }
}
