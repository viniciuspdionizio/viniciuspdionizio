import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactService } from './contact.service';
import { environment } from '../../environments/environment';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  const endpoint = `${environment.netlifyHostUrl}/.netlify/functions/send-email`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST the contact data to the Netlify send-email function', () => {
    const payload = { name: 'Ana', email: 'ana@teste.com', message: 'Olá, tudo bem?' };

    service.sendEmail(payload).subscribe();

    const req = httpMock.expectOne(endpoint);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({ statusCode: 200, body: { success: true } });
  });

  it('should propagate errors from the server', () => {
    const payload = { name: 'Ana', email: 'ana@teste.com', message: 'Olá, tudo bem?' };
    let receivedError: unknown;

    service.sendEmail(payload).subscribe({
      error: (err) => (receivedError = err),
    });

    const req = httpMock.expectOne(endpoint);
    req.flush({ error: 'Erro interno' }, { status: 500, statusText: 'Server Error' });

    expect(receivedError).toBeTruthy();
  });
});
