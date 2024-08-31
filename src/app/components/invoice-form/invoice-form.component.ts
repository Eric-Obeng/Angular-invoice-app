import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  addInvoiceAsDraft,
  addInvoiceAsPending,
} from '../../store/invoice.actions';
import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import { Invoice } from '../../interfaces/invoice';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
})
export class InvoiceFormComponent {
  invoiceForm!: FormGroup;
  @Output() close = new EventEmitter<void>();
  @Input() invoice?: Invoice;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      // Initialize form controls
      billFrom: this.fb.group({
        streetAddress: [
          this.invoice?.senderAddress.street || '',
          Validators.required,
        ],
        city: [this.invoice?.senderAddress.city || '', Validators.required],
        postCode: [
          this.invoice?.senderAddress.postCode || '',
          Validators.required,
        ],
        country: [
          this.invoice?.senderAddress.country || '',
          Validators.required,
        ],
      }),
      billTo: this.fb.group({
        clientName: [this.invoice?.clientName || '', Validators.required],
        clientEmail: [this.invoice?.clientEmail || '', Validators.required],
        streetAddress: [
          this.invoice?.clientAddress.street || '',
          Validators.required,
        ],
        city: [this.invoice?.clientAddress.city || '', Validators.required],
        postCode: [
          this.invoice?.clientAddress.postCode || '',
          Validators.required,
        ],
        country: [
          this.invoice?.clientAddress.country || '',
          Validators.required,
        ],
      }),
      invoiceDate: [this.invoice?.createdAt || '', Validators.required],
      paymentTerms: [this.invoice?.paymentTerms || '', Validators.required],
      projectDescription: [
        this.invoice?.description || '',
        Validators.required,
      ],
      items: this.fb.array(
        this.invoice?.items.map((item) => this.createItem()) || []
      ),
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      itemName: ['', Validators.required], // Initialize with empty string
      quantity: [1, [Validators.required, Validators.min(1)]], // Default quantity
      price: [0, [Validators.required, Validators.min(0)]], // Default price
      total: [{ value: 0, disabled: true }], // Default total
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateTotal(index: number): void {
    const item = this.items.at(index) as FormGroup;
    const quantity = item.get('quantity')?.value ?? 0;
    const price = item.get('price')?.value ?? 0;
    const total = quantity * price;
    item.get('total')?.setValue(total);
  }

  // onSubmit(): void {
  //   console.log(this.invoiceForm.value);
  //   if (this.invoiceForm.valid) {
  //     console.log(this.invoiceForm.value);
  //   }
  // }

  calculatePaymentDue(invoiceDate: string, paymentTerms: number): string {
    const date = new Date(invoiceDate);
    date.setDate(date.getDate() + paymentTerms);
    return date.toISOString();
  }

  calculateTotalInvoiceAmount(items: any[]): number {
    return items.reduce((acc, item) => acc + item.total, 0);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options).replace(' ', '');
  }

  generateShortId(): string {
    return uuidv4().split('-')[0].slice(0, 6);
  }

  saveAsDraft() {
    if (this.invoiceForm.valid) {
      const formValues = this.invoiceForm.value;

      const invoiceData: Invoice = {
        id: this.generateShortId(),
        createdAt: this.formatDate(new Date()),
        paymentDue: this.calculatePaymentDue(
          formValues.invoiceDate,
          formValues.paymentTerms
        ), // Calculate payment due date
        description: formValues.projectDescription,
        paymentTerms: formValues.paymentTerms,
        clientName: formValues.billTo.clientName,
        clientEmail: formValues.billTo.clientEmail,
        status: 'draft',
        senderAddress: {
          street: formValues.billFrom.streetAddress,
          city: formValues.billFrom.city,
          postCode: formValues.billFrom.postCode,
          country: formValues.billFrom.country,
        },
        clientAddress: {
          street: formValues.billTo.streetAddress,
          city: formValues.billTo.city,
          postCode: formValues.billTo.postCode,
          country: formValues.billTo.country,
        },
        items: formValues.items.map((item: any) => ({
          name: item.itemName,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        total: this.calculateTotalInvoiceAmount(formValues.items),
      };

      this.store.dispatch(addInvoiceAsDraft({ invoices: invoiceData }));
    }
    console.log('Just log anything');
  }
  saveAndSend() {
    if (this.invoiceForm.valid) {
      const formValues = this.invoiceForm.value;

      const invoiceData: Invoice = {
        id: this.generateShortId(),
        createdAt: this.formatDate(new Date()),
        paymentDue: this.calculatePaymentDue(
          formValues.invoiceDate,
          formValues.paymentTerms
        ),
        description: formValues.projectDescription,
        paymentTerms: formValues.paymentTerms,
        clientName: formValues.billTo.clientName,
        clientEmail: formValues.billTo.clientEmail,
        status: 'pending',
        senderAddress: {
          street: formValues.billFrom.streetAddress,
          city: formValues.billFrom.city,
          postCode: formValues.billFrom.postCode,
          country: formValues.billFrom.country,
        },
        clientAddress: {
          street: formValues.billTo.streetAddress,
          city: formValues.billTo.city,
          postCode: formValues.billTo.postCode,
          country: formValues.billTo.country,
        },
        items: formValues.items.map((item: any) => ({
          name: item.itemName,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        total: this.calculateTotalInvoiceAmount(formValues.items),
      };

      this.store.dispatch(addInvoiceAsPending({ invoices: invoiceData }));
    }
  }

  closeForm() {
    this.close.emit();
  }
}
