import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {
  BehaviorSubject,
  catchError,
  combineLatest,
  forkJoin,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';

import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';

  //1.1. LLamado a la API de products
  products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((data) => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  //2.1 Combinacion de dos observables: products and categories
  productsWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$,
  ]).pipe(
    map(([products, categories]) =>
      products.map(
        (product) =>
          ({
            ...product,
            price: product.price ? product.price * 1.5 : 0,
            category: categories.find((c) => product.categoryId === c.id)?.name,
            seachKey: [product.productName],
          } as Product)
      )
    )
  );


  // observable de accion de seleccionar un producto para mostrar detalles
  private productSelectdSuject = new BehaviorSubject<number>(0);
  productSelectAction$ = this.productSelectdSuject.asObservable();


  

  // Observables para obetenr datos de un solo producto seleccionado del observable productWithCaetegory
  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectAction$
  ]).pipe(
    map(([products, selectedProductId]) => 
    products.find(product => product.id === selectedProductId),
    ),
    tap(product => console.log('selectedProduct', product))
  );

  // para recuperar los datos de entrada emitidos por el usuario debo hacer esto, pues el observable esta definido aca y no en el componente

  selectedProductChanged(selectedProductId: number): void {
    this.productSelectdSuject.next(selectedProductId)
  }

  
  
  // this.productsWithCategory$.pipe(
  //   map((products) => products.find((product) => product.id === 5)),
  //   tap((product) => console.log('SelectedProduct: ', product))
  // );

  //2.1.1 llamar el servicio a combinar en este servicio
  constructor(
    private http: HttpClient,
    private productCategoryService: ProductCategoryService
  ) {}

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30,
    };
  }

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
