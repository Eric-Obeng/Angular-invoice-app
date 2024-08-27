import { createReducer, on } from '@ngrx/store';
import {
  loadInvoice,
  loadInvoiceSuccess,
  loadInvoiceFailure,
} from './invoice.actions';
import { Invoice } from '../interfaces/invoice';
import { Action } from '@ngrx/store';
import {  InvoiceState, initialState } from '../interfaces/invoice';

// export interface InvoiceState {
//   invoice: Invoice[];
//   error: string | null;
// }

// export const initialState: InvoiceState = {
//   invoice: [],
//   error: null,
// };

const _invoiceReducer = createReducer(
  initialState,
  on(loadInvoice, (state) => ({ ...state, error: null })),
  on(loadInvoiceSuccess, (state, { invoice }) => ({
    ...state,
    invoice,
    error: null,
  })),
  on(loadInvoiceFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function invoiceReducer(
  state: InvoiceState | undefined,
  action: Action
) {
  return _invoiceReducer(state, action);
}
