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
import {
  deleteInvoice,
  loadInvoice,
  loadInvoiceById,
  updateInvoiceStatus,
} from '../../store/invoice.actions';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [
    CommonModule,
    InvoiceStatusComponent,
    InvoiceActionsComponent,
    DeleteModalComponent,
    InvoiceFormComponent,
  ],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
})
export class InvoiceDetailsComponent {
  @Input() invoice!: Invoice;
  invoices$!: Observable<Invoice | undefined>;
  showDeleteModal: boolean = false;
  showForm: boolean = false;
  invoiceId!: string;
  currentInvoice!: Invoice;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;

    this.invoices$ = this.store.select(selectInvoiceById(this.invoiceId));

    this.store.select(selectAllInvoices).subscribe((invoices) => {
      if (invoices.length === 0) {
        this.store.dispatch(loadInvoice());
      }
    });

    this.store.dispatch(loadInvoiceById({ id: this.invoiceId }));

    this.invoices$.subscribe((invoice) => {
      if (invoice) {
        this.currentInvoice = invoice;
      }
    });
  }

  navigateBack() {
    this.router.navigate(['/invoices']);
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }
  onDeleteInvoice(invoiceId: string) {
    this.store.dispatch(deleteInvoice({ id: invoiceId }));
    this.showDeleteModal = true;
    this.navigationToInvoices();
  }

  navigationToInvoices() {
    this.router.navigate(['/invoices']);
  }

  onEdit() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  onMarkAsPaid(invoiceId: string) {
    const newStatus =
      this.currentInvoice.status === 'pending' ? 'paid' : 'pending';
    this.store.dispatch(
      updateInvoiceStatus({ id: invoiceId, status: newStatus })
    );
  }
}
