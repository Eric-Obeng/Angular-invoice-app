import { Component, Input } from '@angular/core';
import { Invoice } from '../../../interfaces/invoice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-status.component.html',
  styleUrl: './invoice-status.component.scss',
})
export class InvoiceStatusComponent {
  @Input() invoice!: Invoice;
}
