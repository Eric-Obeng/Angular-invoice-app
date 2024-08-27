import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  loadInvoice,
  loadInvoiceSuccess,
  loadInvoiceFailure,
} from './invoice.actions';
import { Invoice } from '../interfaces/invoice';

@Injectable()
export class InvoiceEffects {
  private apiUrl = 'assets/data.json';

  constructor(private http: HttpClient, private actions$: Actions) {}

  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadInvoice),
      switchMap(() =>
        this.http.get<Invoice[]>(this.apiUrl).pipe(
          map((invoices) => {
            console.log(invoices);
            return loadInvoiceSuccess({ invoices });
          }),
          catchError((error) => of(loadInvoiceFailure({ error })))
        )
      )
    )
  );
}
