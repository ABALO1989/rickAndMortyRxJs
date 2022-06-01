import { Component } from '@angular/core';
import { catchError, EMPTY, forkJoin, map, Observable, startWith, Subject, BehaviorSubject } from 'rxjs';
import { combineLatest} from 'rxjs/internal/observable/combineLatest';

import { CharacterTypeService } from '../character-type/character-type.service';
import { CharacterService } from './character.service';

@Component({
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
})
export class CharacterListComponent {
  pageTitle = 'Charater List';
  imageWidth: number =70;


  //Observable de acción para el manejo de errores
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();



  //////////////////////////////////////////////////////////////////////////////////////
  //REACTION TO ACTIONS (RA)
  //RA1. CREAR FLUJO DE ACCION: emitira el ID de categoria seleccionada, cada vez que el usuario selecciona una
      //private porque ningun otro codigo deberia usar este subjeto, simpre debemos ponerlo asi y EXPONEMOS LOS SUBJETOS OBSERVABLES
  //RA2.COMBINAR EL FLUJO DE ACCION CON EL FLUJO DE DATOS
  //RA3.

  private typeSelectedSubject = new BehaviorSubject<string>('');
  typeSelectedAction$ = this.typeSelectedSubject.asObservable();

//combinar caracteres con typeLocation
  characters$= combineLatest([
    this.characterService.characterWithType$,
    this.typeSelectedAction$])
  .pipe (
    map(([characters, selectedTypeDimension])=>
    characters.filter(character =>
      selectedTypeDimension ? character.typeLocation === selectedTypeDimension : true
  )),
  catchError(err => {
    this.errorMessageSubject.next(err);
    return EMPTY
  })
  )

// 3.2 Obervable de categorias, que recibe la informacion sel servicio productCategoty y del observable productCategories
  types$ = this.characterTypeService.characterType$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(
    private characterService: CharacterService,
    private characterTypeService: CharacterTypeService
  ) {}

  

  onSelected(typeDimension: string): void {
    this.typeSelectedSubject.next(typeDimension)
  }


}
