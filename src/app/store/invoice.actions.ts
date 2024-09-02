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

export const addInvoice = createAction(
  '[Invoice] Add Invoice',
  props<{ invoices: Invoice }>()
);

// export const addInvoiceAsPending = createAction(
//   '[Invoice] Add Invoice As Pending',
//   props<{ invoices: Invoice }>()
// );

export const setSelectedStatus = createAction(
  '[Invoice] Set Status',
  props<{ selectedStatuses: string[] }>()
);

export const deleteInvoice = createAction(
  '[Invoice] Delete Invoice',
  props<{ id: string }>()
);

export const loadInvoiceById = createAction(
  '[Invoice] Load Invoice By Id',
  props<{ id: string }>()
);

export const updateInvoiceStatus = createAction(
  '[Invoice] Update Invoice Status',
  props<{ id: string; status: 'pending' | 'paid' }>()
);
