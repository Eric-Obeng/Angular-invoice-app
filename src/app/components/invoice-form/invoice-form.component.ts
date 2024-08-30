import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      // bill from
      billFrom: this.fb.group({
        streetAddress: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),

      // bill to
      billTo: this.fb.group({
        clientName: ['', Validators.required],
        clientEmail: ['', Validators.required],
        streetAddress: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),

      // invoice details
      invoiceDate: ['', Validators.required],
      paymentTerms: ['', Validators.required],
      projectDescription: ['', Validators.required],

      items: this.fb.array([this.createItem()]),
    });
  }


  createItem(): FormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }],
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
