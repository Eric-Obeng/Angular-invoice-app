import { createSelector, createFeatureSelector } from '@ngrx/store';
import { InvoiceState, invoiceAdapter } from './invoice.entity';

// Get the feature state
export const selectInvoiceState =
  createFeatureSelector<InvoiceState>('invoices');

// Use adapter's selectors
const { selectIds, selectEntities, selectAll, selectTotal } =
  invoiceAdapter.getSelectors(selectInvoiceState);

// Export necessary selectors
export const selectAllInvoices = selectAll;

export const selectInvoiceById = (invoiceId: string) =>
  createSelector(selectEntities, (entities) => entities[invoiceId]);

export const selectStatus = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.selectedStatuses
);

export const selectFilteredInvoice = createSelector(
  selectStatus,
  selectAllInvoices,
  (selectedStatuses, allInvoices) => {
    if (selectedStatuses.length > 0) {
      return allInvoices.filter((invoice) =>
        selectedStatuses.includes(invoice.status)
      );
    }
    return allInvoices;
  }
);
