import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

interface ResendResponse {
  statusCode: number;
  body: string | { success: boolean } | { error: any };
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly apiUrl = environment.netlifyHostUrl;

  constructor(private http: HttpClient) {}

  sendEmail(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) {
    return this.http.post<ResendResponse>(
      `${this.apiUrl}/.netlify/functions/send-email`,
      { ...data },
    );
  }
}
