import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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
    );
  }
}
