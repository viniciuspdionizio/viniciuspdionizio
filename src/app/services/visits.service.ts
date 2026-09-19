import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Visit {
  timestamp: string;
  path: string;
  referrer: string;
  locale: string;
  userAgent: string;
  ipHash: string;
  country: string | null;
  region: string | null;
  city: string | null;
  org: string | null;
}

@Injectable({ providedIn: 'root' })
export class VisitsService {
  private readonly apiUrl = environment.netlifyHostUrl;
  private readonly http = inject(HttpClient);

  list(token: string): Observable<{ visits: Visit[] }> {
    return this.http.get<{ visits: Visit[] }>(`${this.apiUrl}/.netlify/functions/list-visits`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
