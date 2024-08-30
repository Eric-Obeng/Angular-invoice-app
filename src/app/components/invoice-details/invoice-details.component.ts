import { Component, Input } from '@angular/core';
import {
  selectAllInvoices,
  selectInvoiceById,
} from '../../store/invoice.selector';
import { Invoice } from '../../interfaces/invoice';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/invoice.state';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceStatusComponent } from '../shared/invoice-status/invoice-status.component';
import { InvoiceActionsComponent } from '../shared/invoice-actions/invoice-actions.component';
import { DeleteModalComponent } from '../shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [
    CommonModule,
    InvoiceStatusComponent,
    InvoiceActionsComponent,
    DeleteModalComponent,
  ],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
})
export class InvoiceDetailsComponent {
  @Input() invoice!: Invoice;

  invoices$!: Observable<Invoice | undefined>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const invoiceId = this.route.snapshot.paramMap.get('id');

    if (invoiceId) {
      this.invoices$ = this.store.select(selectInvoiceById(invoiceId));
    }
  }

  navigateBack() {
    this.router.navigate(['/invoices']);
  }
}
