import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from '../interfaces/invoice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private dataUrl = 'assets/data.json';

  constructor(private http: HttpClient) {}

  getInvoice(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.dataUrl);
  }
}
