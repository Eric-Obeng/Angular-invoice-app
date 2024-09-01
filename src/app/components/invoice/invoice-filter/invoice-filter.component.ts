import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { setSelectedStatus } from '../../../store/invoice.actions';

@Component({
  selector: 'app-invoice-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-filter.component.html',
  styleUrl: './invoice-filter.component.scss',
})
export class InvoiceFilterComponent {
  showFilterDropDown: boolean = false;
  selectedStatuses: string[] = [];
  statuses: string[] = ['draft', 'pending', 'paid'];

  @Output() filterClicked = new EventEmitter<void>();
  @Output() status = new EventEmitter<string[]>();

  constructor(private store: Store) {}

  displayDropDown() {
    this.showFilterDropDown = !this.showFilterDropDown;
    this.filterClicked.emit();
  }

  getSelectedStatus(status: string) {
    this.selectedStatuses = this.selectedStatuses.includes(status)
      ? this.selectedStatuses.filter((s) => s !== status)
      : [...this.selectedStatuses, status];
    this.store.dispatch(
      setSelectedStatus({ selectedStatuses: this.selectedStatuses })
    );
    this.status.emit(this.selectedStatuses);
  }
}
