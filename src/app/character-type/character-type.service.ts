import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { throwError, Observable, tap, catchError, shareReplay, map } from 'rxjs';
import { apiType } from './character-type';

@Injectable({
  providedIn: 'root',
})
export class CharacterTypeService {
  private characterTypeUrl = 'https://rickandmortyapi.com/api/location';

  //3.1 llamado a API location
  characterType$ = this.http.get<apiType>(this.characterTypeUrl )
  .pipe(
    map((response) => response.results),
    tap((data) => console.log('types: ', JSON.stringify(data))),
    shareReplay(1), // con esto queda almacenado la informacion de las categorias en el bufer y asi no hace tantos llamados al servidor, sino que los otrso que se sucriben ya obtienen la ifnormacion del bufer
    //tap((data) => console.log('After shareReplay ')),esto solo para ver las veces que se reproducen las caegorias en el template
    catchError(this.handleError)
  );

  constructor(private http: HttpClient) {}

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
