import { ChangeDetectionStrategy, Component } from '@angular/core';

import { catchError, EMPTY, Subject, Subscription } from 'rxjs';

import { Product } from '../character';
import { ProductService } from '../character.service';

@Component({
  selector: 'pm-character-list',
  templateUrl: './character-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterListAltComponent  {
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
