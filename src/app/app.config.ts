import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
// CLDR não tem um arquivo "pt-BR" separado: 'pt' já É o português do Brasil
// (pt-PT tem seu próprio arquivo à parte para o português europeu). Um aviso
// benigno de build ("Using locale data for 'pt'") é esperado e correto.
import localePt from '@angular/common/locales/pt';

import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

// pt-BR não vem registrado por padrão no Angular (só en-US vem). LOCALE_ID em
// si é definido automaticamente pelo build localizado do Angular CLI (ver
// "i18n" em angular.json) — não deve ser sobrescrito aqui, senão todo build
// (inclusive o en-US) herdaria o mesmo LOCALE_ID fixo.
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideClientHydration(),
  ]
};
