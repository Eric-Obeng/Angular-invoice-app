import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Invoice } from '../../../interfaces/invoice';

@Component({
  selector: 'app-invoice-actions',
  standalone: true,
  imports: [],
  templateUrl: './invoice-actions.component.html',
  styleUrl: './invoice-actions.component.scss',
})
export class InvoiceActionsComponent {
  @Input() invoice!: Invoice;
  @Output() deleteClicked = new EventEmitter<void>();
  @Output() editClicked = new EventEmitter<void>();
  @Output() markAsPaid = new EventEmitter<void>();

  onDeleteClick() {
    this.deleteClicked.emit();
  }

  onEditClick() {
    this.editClicked.emit();
  }

  onMarkAsPaidClick() {
    this.markAsPaid.emit();
  }

  getMarkAsPaidButtonText(): string {
    if (!this.invoice) {
      return '';
    }
    return this.invoice.status === 'pending'
      ? 'Mark as Paid'
      : 'Mark as Pending';
  }
}
