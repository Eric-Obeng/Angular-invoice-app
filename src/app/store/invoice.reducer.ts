import { createReducer, on } from '@ngrx/store';
import {
  loadInvoice,
  loadInvoiceSuccess,
  loadInvoiceFailure,
  addInvoiceAsDraft,
  addInvoiceAsPending,
  setSelectedStatus,
  deleteInvoice,
  loadInvoiceById,
  updateInvoiceStatus,
} from './invoice.actions';
import { Invoice } from '../interfaces/invoice';
import { Action } from '@ngrx/store';
import { InvoiceState, initialState } from '../interfaces/invoice';

// export interface InvoiceState {
//   invoice: Invoice[];
//   error: string | null;
// }

// export const initialState: InvoiceState = {
//   invoice: [],
//   error: null,
// };

export const _invoiceReducer = createReducer(
  initialState,
  on(loadInvoice, (state) => ({ ...state, error: null })),
  on(loadInvoiceSuccess, (state, { invoices }) => ({
    ...state,
    invoices,
    error: null,
  })),
  on(loadInvoiceFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(addInvoiceAsDraft, (state, { invoices }) => ({
    ...state,
    invoices: [...state.invoices, invoices],
  })),
  on(addInvoiceAsPending, (state, { invoices }) => ({
    ...state,
    invoices: [...state.invoices, invoices],
  })),
  on(setSelectedStatus, (state, { selectedStatuses }) => ({
    ...state,
    selectedStatuses,
  })),
  on(deleteInvoice, (state, { id }) => ({
    ...state,
    invoices: state.invoices.filter((invoice) => invoice.id !== id),
  })),
  on(loadInvoiceById, (state, { id }) => {
    const selectedInvoice = state.invoices.find((invoice) => invoice.id === id);
    return {
      ...state,
      selectedInvoice: selectedInvoice || undefined,
    };
  }),
  on(updateInvoiceStatus, (state, { id, status }) => ({
    ...state,
    invoices: state.invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, status } : invoice
    ),
  }))
);

export function invoiceReducer(
  state: InvoiceState | undefined,
  action: Action
) {
  return _invoiceReducer(state, action);
}
