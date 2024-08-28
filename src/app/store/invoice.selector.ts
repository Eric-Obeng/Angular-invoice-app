import { createSelector } from '@ngrx/store';
import { AppState } from './invoice.state';
import { InvoiceState } from '../interfaces/invoice';

export const selectInvoiceState = (state: AppState) => {
  console.log('Current AppState:', state);
  return state.invoices;
};

export const selectAllInvoices = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.invoices
);

export const selectInvoiceById = (invoiceId: string) =>
  createSelector(selectInvoiceState, (state: InvoiceState) =>
    state.invoices.find((invoice) => invoice.id === invoiceId)
  );
