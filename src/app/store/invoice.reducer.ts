import { createReducer, on } from '@ngrx/store';
import { Invoice } from '../interfaces/invoice';
import { Action } from '@ngrx/store';
import {
  invoiceAdapter,
  initialInvoiceState,
  InvoiceState,
} from './invoice.entity';
import {
  loadInvoice,
  loadInvoiceSuccess,
  loadInvoiceFailure,
  addInvoice,
  setSelectedStatus,
  deleteInvoice,
  updateInvoiceStatus,
} from './invoice.actions';

export const _invoiceReducer = createReducer(
  initialInvoiceState,
  on(loadInvoice, (state) => ({ ...state, error: null })),
  on(loadInvoiceSuccess, (state, { invoices }) =>
    invoiceAdapter.setAll(invoices, { ...state, error: null })
  ),
  on(loadInvoiceFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(addInvoice, (state, { invoices }) =>
    invoiceAdapter.addOne(invoices, state)
  ),
  on(setSelectedStatus, (state, { selectedStatuses }) => ({
    ...state,
    selectedStatuses,
  })),
  on(deleteInvoice, (state, { id }) => invoiceAdapter.removeOne(id, state)),
  on(updateInvoiceStatus, (state, { id, status }) =>
    invoiceAdapter.updateOne({ id, changes: { status } }, state)
  )
);

export function invoiceReducer(
  state: InvoiceState | undefined,
  action: Action
) {
  return _invoiceReducer(state, action);
}
