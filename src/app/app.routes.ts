import { Routes } from '@angular/router';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';

export const routes: Routes = [
  {
    path: 'invoices',
    component: InvoiceComponent,
  },
  {
    path: 'invoices/:id',
    component: InvoiceDetailsComponent,
  },
  {
    path: '**',
    redirectTo: 'invoices',
  },
];
