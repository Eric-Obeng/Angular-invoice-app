import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss',
})
export class DeleteModalComponent {
  @Output() deleteConfirmed = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();
  @Input() invoiceId!: string;

  private route = inject(Router);

  confirmDelete() {
    this.deleteConfirmed.emit(this.invoiceId);
  }

  cancelDelete() {
    this.closeModal.emit();
  }
}
