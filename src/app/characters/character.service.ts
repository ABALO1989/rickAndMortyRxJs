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

import { Character, Iapi} from './character';
import { CharacterTypeService } from '../character-type/character-type.service';
import { SupplierService } from '../suppliers/supplier.service';
import { Supplier } from '../suppliers/supplier';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private characterUrl = 'https://rickandmortyapi.com/api/character/';
  private suppliersUrl = 'api/suppliers';

  //1.1. LLamado a la API de products
  characters$ = this.http.get<Iapi>(this.characterUrl).pipe(
    map((response) => response.results),
    catchError(this.handleError)
  );

  //2.1 Combinacion de dos observables: products and categories
  characterWithType$ = combineLatest([
    this.characters$,
    this.characterTypeService.characterType$
  ]).pipe(
    map(([characters, types]) =>
        characters.map(
          (character) =>
            ({
              ...character,
              typeLocation: types.find((c) => character.location.name === c.name)?.type,
              seachKey: [character.name],
            } as Character)
        ),
     shareReplay(1), 
     
    )
  );

  // observable de accion de seleccionar un producto para mostrar detalles
  private characterSelectdSuject = new BehaviorSubject<number>(0);
  characterSelectAction$ = this.characterSelectdSuject.asObservable();

  // para recuperar los datos de entrada emitidos por el usuario debo hacer esto, pues el observable esta definido aca y no en el componente

  selectedCharacterChanged(selectedCharacterId: number): void {
    this.characterSelectdSuject.next(selectedCharacterId);
  }

  // observable de accion para agrgar un nuevo personaje
  private characterInsertedSuject = new Subject<Character>();
  characterInsertedAction$ = this.characterInsertedSuject.asObservable();

  characterWithAdd$ = merge(
    this.characterWithType$,
    this.characterInsertedAction$
  ).pipe(
    scan(
      (acc, value) => (value instanceof Array ? [...value] : [...acc, value]),
      [] as Character[]
    )
  );

  // Observables para obetenr datos de un solo producto seleccionado del observable productWithCaetegory
  selectedCharacter$ = combineLatest([
    this.characterWithType$,
    this.characterSelectAction$,
  ]).pipe(
    map(([characters, selectedCharacterId]) =>
      characters.find((character) => character.id === selectedCharacterId)
    ),
    tap((character) => console.log('selectedCharacter', character)),
    shareReplay(1)
  );


  //Obtener proveedores por producto seleccionado. Metodo Just in Time
  selectedCharacterSupplier$ = this.selectedCharacter$.pipe(
    filter((character) => Boolean(character)), //este filter sirve para no intentar obtener proveedores sino hay productos seleecionados
    switchMap((selectedCharacter) => {
      if (selectedCharacter?.supplierIds) {
        return forkJoin(
          selectedCharacter.supplierIds.map((supplierId) =>
            this.http.get<Supplier>(`${this.suppliersUrl}/${supplierId}`)
          )
        );
      } else {
        return of([]);
      }
    }),
    tap((suppliers) => console.log('Suppliers: ', JSON.stringify(suppliers)))
  );

  addCharacter(newCharacter?: Character) {
    newCharacter = newCharacter || this.fakeCharacter();
    this.characterInsertedSuject.next(newCharacter);
  }

  constructor(
    private http: HttpClient,
    private characterTypeService: CharacterTypeService,
    private supplierService: SupplierService
  ) {}

  private fakeCharacter(): Character {
    return {
      id: 98,
      name: 'test',
      status: 'dead',
      species: 'Human',
      image:'',
      location:{name:'', url:''}
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
