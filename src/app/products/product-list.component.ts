import { Component } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';

import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  seletedCategoryId = 1;


  //1.2 Observable de productos, si quiero solo la info de productos debo asiganr el observable al final de products$
  //2.2 Observable de productos pero ya con las categorias transformadas
  products$ = this.productService.productWithCategory$ //importantttt aca lo asocio al nuevo observable
    .pipe(
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY;
      })
    );
  
// 3.2 Obervable de categorias, que recibe la informacion sel servicio productCategoty y del observable productCategories
  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );


  // 4. observable de productos con categorias que cumplen una funcion especificada
  //en este caso emitira una lista de productos por categorias
  productsSimpleFilter$ = this.productService.productWithCategory$.pipe(
    map((products) =>
      products.filter((product) =>
        this.seletedCategoryId
          ? product.categoryId === this.seletedCategoryId
          : true
      )
    )
  );

  // 3.3 Inyectar los servicios a usar en el componente
  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  onAdd(): void {
    console.log('Not yet implemented');
  }

  //5. este metodo se ejecuta cuando selecciono una de las opciones de categories presentes en el filtro
  // quiero decir que el parametro selectedCategoryId sera igual a la Id de la categoria seleccionada
  // el + es para convertir el string en un numero
  onSelected(categoryId: string): void {
    this.seletedCategoryId = +categoryId; 
  }
}
