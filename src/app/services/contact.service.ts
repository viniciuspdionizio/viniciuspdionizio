import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }


  sendEmail(data: { name: string, email: string, phone?: string, message: string }) {
    this.http.post('', data);
  }



}
