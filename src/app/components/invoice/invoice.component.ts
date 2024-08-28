import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadInvoice } from '../../store/invoice.actions';
import { HttpClient } from '@angular/common/http';
import { ButtonComponent } from '../shared/button/button.component';
import { InvoiceFilterComponent } from './invoice-filter/invoice-filter.component';
import { selectAllInvoices } from '../../store/invoice.selector';
import { Observable } from 'rxjs';
import { Invoice, InvoiceState } from '../../interfaces/invoice';
import { AppState } from '../../store/invoice.state';
import { CommonModule } from '@angular/common';
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    ButtonComponent,
    InvoiceFilterComponent,
    CommonModule,
    InvoiceItemComponent,
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent {
  invoices$: Observable<Invoice[]> = this.store.select(selectAllInvoices);

  constructor(private store: Store<AppState>, private http: HttpClient) {
    this.invoices$.subscribe((res) => {
      console.log(res); // Log fetched invoices for debugging purposes
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadInvoice());
  }
}
