import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, map } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../character';

import { ProductService } from '../character.service';

@Component({
  selector: 'pm-character-detail',
  templateUrl: './character-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterDetailComponent {
  errorMessage = '';


  product$ = this.productService.selectedProduct$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  pageTitle$ = this.product$
  .pipe(
    map(p=> p ? `Product Detail for: ${p.productName}`: null)
  );


  productSuppliers$ = this.productService.selectedProductSupplier$
  .pipe(
    catchError(err=> {
      this.errorMessage = err;
      return EMPTY;
    })
  )

  //para eviatar usar tantas observbales en nuestra plantilla del componente, se pueden unir todos los observables de un componetente en uno solo
    //combinando todos los flujos de datos

    vm$ = combineLatest([
      this.product$,
      this.productSuppliers$,
      this.pageTitle$
    ]).
    pipe(
      filter(([product]) => Boolean(product)),
    map (([product, productSuppliers, pageTitle]) =>
    ({product, productSuppliers, pageTitle}))
    );

  constructor(private productService: ProductService) { }

}
