import { ChangeDetectionStrategy, Component } from '@angular/core';

import { catchError, EMPTY, Subject, Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent  {
  pageTitle = 'Products';
  
  //Observable de acción para el manejo de errores
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  


  //observable que emite todos los productos
  products$ = this.productService.productsWithAdd$
  .pipe(catchError(err => {
    this.errorMessageSubject.next(err);
    return EMPTY
  }));


  //observable que emite el producto seleccionado
  selectedProduct$ = this.productService.selectedProduct$;


  

  constructor(private productService: ProductService) { }




  onSelected(productId: number): void {
   this.productService.selectedProductChanged(productId);
  }
}
