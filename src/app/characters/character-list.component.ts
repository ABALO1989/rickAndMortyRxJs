import { Component } from '@angular/core';
import { catchError, EMPTY, forkJoin, map, Observable, startWith, Subject, BehaviorSubject } from 'rxjs';
import { combineLatest} from 'rxjs/internal/observable/combineLatest';

import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { ProductService } from './character.service';

@Component({
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
})
export class CharacterListComponent {
  pageTitle = 'Charater List';


  //Observable de acción para el manejo de errores
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();



  //////////////////////////////////////////////////////////////////////////////////////
  //REACTION TO ACTIONS (RA)
  //RA1. CREAR FLUJO DE ACCION: emitira el ID de categoria seleccionada, cada vez que el usuario selecciona una
      //private porque ningun otro codigo deberia usar este subjeto, simpre debemos ponerlo asi y EXPONEMOS LOS SUBJETOS OBSERVABLES
  //RA2.COMBINAR EL FLUJO DE ACCION CON EL FLUJO DE DATOS
  //RA3.

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();


  products$= combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$])
  .pipe (
    map(([products, selectedCategoryId])=>
    products.filter(product =>
      selectedCategoryId ? product.categoryId === selectedCategoryId : true
  )),
  catchError(err => {
    this.errorMessageSubject.next(err);
    return EMPTY
  })
  )

// 3.2 Obervable de categorias, que recibe la informacion sel servicio productCategoty y del observable productCategories
  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId)
  }


  // //1.2 Observable de productos, si quiero solo la info de productos debo asiganr el observable al final de products$
  // //2.2 Observable de productos pero ya con las categorias transformadas
  // products$ = this.productService.productWithCategory$ //importantttt aca lo asocio al nuevo observable
  //   .pipe(
  //     catchError((err) => {
  //       this.errorMessageSubject.next(err);
  //       return EMPTY;
  //     })
  //   );

  // 4. observable de productos con categorias que cumplen una funcion especificada
  //en este caso emitira una lista de productos por categorias
//hasta este punto no actulaiza la accion del usuario al seleccionar otra categoria por ello hay que implementar la reaccion a acciones

  // productsSimpleFilter$ = this.productService.productWithCategory$.pipe(
  //   map((products) =>
  //     products.filter((product) =>
  //       this.seletedCategoryId
  //         ? product.categoryId === this.seletedCategoryId
  //         : true
  //     )
  //   )
  // );

  // 3.3 Inyectar los servicios a usar en el componente


  //5. este metodo se ejecuta cuando selecciono una de las opciones de categories presentes en el filtro
  // quiero decir que el parametro selectedCategoryId sera igual a la Id de la categoria seleccionada
  // el + es para convertir el string en un numero
  // onSelected(categoryId: string): void {
  //   this.seletedCategoryId = +categoryId;
  // }
}
