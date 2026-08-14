import { HttpClient } from '@angular/common/http';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { environment } from './../../environments/environment';

interface ResendResponse {
  statusCode: number;
  body: string | { success: boolean } | { error: string };
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly apiUrl = environment.netlifyHostUrl;
  private readonly http = inject(HttpClient);
  private readonly locale = inject(LOCALE_ID);

  sendEmail(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    /** Honeypot: campo invisível que deve permanecer vazio. Preenchido = bot. */
    website?: string;
  }) {
    return this.http.post<ResendResponse>(
      `${this.apiUrl}/.netlify/functions/send-email`,
      { ...data },
      // A function usa isso só para escolher o idioma das mensagens de erro
      // que devolve (ver netlify/functions/send-email.ts) — não influencia
      // o e-mail enviado ao dono do site, que continua sempre em pt-BR.
      { headers: { 'X-App-Locale': this.locale } },
    );
  }
}
