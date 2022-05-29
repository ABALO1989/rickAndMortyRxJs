import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { throwError, Observable, tap, catchError, shareReplay } from 'rxjs';
import { ProductCategory } from './product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  private productCategoriesUrl = 'api/productCategories';

  //3.1 llamado a API categorias
  productCategories$ = this.http.get<ProductCategory[]>(this.productCategoriesUrl)
  .pipe(
    tap((data) => console.log('categories: ', JSON.stringify(data))),
    shareReplay(1), // con esto queda almacenado la informacion de las categorias en el bufer y asi no hace tantos llamados al servidor, sino que los otrso que se sucriben ya obtienen la ifnormacion del bufer
    //tap((data) => console.log('After shareReplay ')),esto solo para ver las veces que se reproducen las caegorias en el template
    catchError(this.handleError)
  );

  constructor(private http: HttpClient) {}

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
