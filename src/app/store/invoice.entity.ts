import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Invoice } from '../interfaces/invoice';

export interface InvoiceState extends EntityState<Invoice> {
  invoices: Invoice[];
  error: string | null;
  selectedStatuses: string[];
}

export const invoiceAdapter: EntityAdapter<Invoice> =
  createEntityAdapter<Invoice>({
    selectId: (invoice: Invoice) => invoice.id,
    sortComparer: false,
  });

export const initialInvoiceState: InvoiceState = invoiceAdapter.getInitialState(
  {
    invoices: [],
    loading: false,
    error: null,
    selectedStatuses: [],
  }
);
