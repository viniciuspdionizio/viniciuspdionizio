import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

// CLDR não tem um arquivo "pt-BR" separado: o locale base "pt" já usa as
// convenções do Brasil (Portugal é o variante "pt-PT"). O LOCALE_ID como
// 'pt-BR' continua correto — o Angular cai para os dados de "pt" registrados
// aqui quando não encontra o país exato.
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideClientHydration(),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
