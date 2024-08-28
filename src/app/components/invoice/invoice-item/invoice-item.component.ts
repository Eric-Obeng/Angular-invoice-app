import { Component, Input } from '@angular/core';
import { selectAllInvoices } from '../../../store/invoice.selector';
import { Observable } from 'rxjs';
import { Invoice } from '../../../interfaces/invoice';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/invoice.state';
import { HttpClient } from '@angular/common/http';
import { loadInvoice } from '../../../store/invoice.actions';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceStatusComponent } from "../../shared/invoice-status/invoice-status.component";

@Component({
  selector: 'app-invoice-item',
  standalone: true,
  imports: [CommonModule, InvoiceStatusComponent],
  templateUrl: './invoice-item.component.html',
  styleUrl: './invoice-item.component.scss',
})
export class InvoiceItemComponent {
  @Input() invoice!: Invoice;

  invoices$: Observable<Invoice[]> = this.store.select(selectAllInvoices);

  constructor(private store: Store<AppState>, private router: Router) {
    this.invoices$.subscribe((res) => {
      console.log(res); // Log fetched invoices for debugging purposes
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadInvoice());
  }

  viewInvoiceDeatil(invoiceId: string) {
    console.log('navigate:', invoiceId);
    this.router.navigate(['/invoices', invoiceId]);
  }
}
