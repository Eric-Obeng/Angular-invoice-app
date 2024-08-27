import { createSelector } from '@ngrx/store';
import { AppState } from './invoice.state';
import { InvoiceState } from '../interfaces/invoice';

export const selectInvoiceState = (state: AppState) => state.invoices;

export const selectAllInvoices = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.invoices
);
