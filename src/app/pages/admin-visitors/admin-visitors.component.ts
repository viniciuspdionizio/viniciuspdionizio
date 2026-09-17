import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VisitsService, Visit } from '../../services/visits.service';

const TOKEN_STORAGE_KEY = 'admin-visitors-token';

@Component({
  selector: 'app-admin-visitors',
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-visitors.component.html',
  styleUrl: './admin-visitors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminVisitorsComponent {
  private readonly visitsService = inject(VisitsService);

  readonly tokenInput = signal('');
  readonly visits = signal<Visit[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly authenticated = signal(false);

  constructor() {
    // sessionStorage não existe durante o SSR/prerender — o catch em
    // readStoredToken() cobre isso, então esta chamada nunca dispara no servidor.
    const storedToken = this.readStoredToken();
    if (storedToken) {
      this.tokenInput.set(storedToken);
      this.fetchVisits(storedToken);
    }
  }

  onSubmit(): void {
    const token = this.tokenInput().trim();
    if (!token) return;
    this.fetchVisits(token);
  }

  location(visit: Visit): string {
    return [visit.city, visit.region, visit.country].filter(Boolean).join(', ') || '—';
  }

  private fetchVisits(token: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.visitsService.list(token).subscribe({
      next: ({ visits }) => {
        this.visits.set(visits);
        this.authenticated.set(true);
        this.loading.set(false);
        this.storeToken(token);
      },
      error: () => {
        this.error.set('Token inválido ou erro ao carregar os dados.');
        this.authenticated.set(false);
        this.loading.set(false);
      },
    });
  }

  private readStoredToken(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private storeToken(token: string): void {
    try {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // sessionStorage indisponível (ex: modo privado) — segue sem persistir.
    }
  }
}
