import { createSelector } from '@ngrx/store';
import { AppState } from './invoice.state';
import { Invoice, InvoiceState } from '../interfaces/invoice';

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

export const selectStatus = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.selectedStatuses
);

export const selectFilteredInvoice = createSelector(
  selectStatus,
  selectAllInvoices,
  (selectedStatuses: string[], allInvoices: Invoice[]) => {
    console.log(allInvoices);
    if (selectedStatuses.length > 0) {
      return allInvoices.filter((invoice) =>
        selectedStatuses.includes(invoice.status)
      );
    }
    return allInvoices;
  }
);
