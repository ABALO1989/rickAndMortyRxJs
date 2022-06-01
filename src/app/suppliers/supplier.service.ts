import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable, tap, shareReplay, catchError, map } from 'rxjs';
import { ApiEpisode, Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'https://rickandmortyapi.com/api/episode';

  suppliers$ = this.http.get<ApiEpisode>(this.suppliersUrl)
  .pipe(
    map((response) => response.results),
    catchError(this.handleError),
    shareReplay(1),
  );

  constructor(private http: HttpClient) { }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
