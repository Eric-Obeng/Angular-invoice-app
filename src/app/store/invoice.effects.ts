import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { map, catchError, switchMap, tap, mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import {
  loadInvoice,
  loadInvoiceSuccess,
  loadInvoiceFailure,
  addInvoiceAsDraft,
  addInvoiceAsPending,
} from './invoice.actions';
import { Invoice } from '../interfaces/invoice';
import { InvoiceService } from '../services/invoice.service';
import { Action } from '@ngrx/store';

@Injectable()
export class InvoiceEffects {
  private apiUrl = 'assets/data.json';

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private invoiceService: InvoiceService
  ) {}

  loadInvoices$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(loadInvoice),
      mergeMap(() => {
        const localStorageInvoice = localStorage.getItem('invoices');
        if (localStorageInvoice) {
          const invoices: Invoice[] = JSON.parse(localStorageInvoice);
          return of(loadInvoiceSuccess({ invoices }));
        } else {
          return this.invoiceService.getInvoice().pipe(
            tap((invoices: Invoice[]) => {
              localStorage.setItem('invoices', JSON.stringify(invoices));
            }),
            map((invoices: Invoice[]) => {
              localStorage.setItem('invoices', JSON.stringify(invoices));
              return loadInvoiceSuccess({ invoices });
            }),
            catchError((error) => of(loadInvoiceFailure({ error })))
          );
        }
      })
    )
  );
}
