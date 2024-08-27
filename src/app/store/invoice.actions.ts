import { createAction, props } from '@ngrx/store';
import { Invoice } from '../interfaces/invoice';

export const loadInvoice = createAction('[Invoice] Load Invoice');

export const loadInvoiceSuccess = createAction(
  '[Invoice] Load Invoice Success',
  props<{ invoices: Invoice[] }>()
);

export const loadInvoiceFailure = createAction(
  '[Invoice] Load Invoice Failure',
  props<{ error: any }>()
);
