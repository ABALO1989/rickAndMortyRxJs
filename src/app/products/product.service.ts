import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {
  BehaviorSubject,
  catchError,
  combineLatest,
  filter,
  forkJoin,
  map,
  merge,
  Observable,
  of,
  scan,
  shareReplay,
  Subject,
  Subscriber,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { SupplierService } from '../suppliers/supplier.service';
import { Supplier } from '../suppliers/supplier';

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
      ),shareReplay(1)
    )
  );

  // observable de accion de seleccionar un producto para mostrar detalles
  private productSelectdSuject = new BehaviorSubject<number>(0);
  productSelectAction$ = this.productSelectdSuject.asObservable();

  // Observables para obetenr datos de un solo producto seleccionado del observable productWithCaetegory
  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectAction$,
  ]).pipe(
    map(([products, selectedProductId]) =>
      products.find((product) => product.id === selectedProductId)
    ),
    tap((product) => console.log('selectedProduct', product)),
    shareReplay(1)
  );

  // //Obtener proveedores de los productos. Metodo Get All. todos los proveedores a la vez 
  //   selectedProductSupplier$= combineLatest([
  //     this.selectedProduct$,
  //     this.supplierService.suppliers$
  //   ]).
  //   pipe(
  //     map(([selectedProduct, suppliers]) =>
  //     suppliers.filter(supplier => selectedProduct?.supplierIds?.includes(supplier.id))
  //   )
  //   )


  //Obtener proveedores por producto seleccionado. Metodo Just in Time
  selectedProductSupplier$ = this.selectedProduct$
  .pipe(
    filter(product => Boolean(product)), //este filter sirve para no intentar obtener proveedores sino hay productos seleecionados
    switchMap(selectedProduct => {
      if (selectedProduct?.supplierIds){
        return forkJoin(selectedProduct.supplierIds.map(supplierId =>
          this.http.get<Supplier>(`${this.suppliersUrl}/${supplierId}`)))
      }else {
        return of([])
      }
    }), 
    tap(suppliers=>console.log('Suppliers: ', JSON.stringify(suppliers)))
  );



  // para recuperar los datos de entrada emitidos por el usuario debo hacer esto, pues el observable esta definido aca y no en el componente

  selectedProductChanged(selectedProductId: number): void {
    this.productSelectdSuject.next(selectedProductId);
  };

  // observable de accion para agrgar un nuevo producto
  private productInsertedSuject = new Subject<Product>();
  productInsertedAction$ = this.productInsertedSuject.asObservable();

  productsWithAdd$ = merge(
    this.productsWithCategory$,
    this.productInsertedAction$
  ).pipe(
    scan((acc, value)=>
    (value instanceof Array)? [...value] : [...acc, value], [] as Product[])
  );

    addProduct(newProduct?: Product) {
      newProduct = newProduct || this.fakeProduct();
      this.productInsertedSuject.next(newProduct)
    };

  constructor(
    private http: HttpClient,
    private productCategoryService: ProductCategoryService,
    private supplierService: SupplierService
  ) {}

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30,
    };
  }

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
