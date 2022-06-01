import { ChangeDetectionStrategy, Component } from '@angular/core';

import { catchError, EMPTY, Subject, Subscription } from 'rxjs';


import { CharacterService } from '../character.service';

@Component({
  selector: 'pm-character-list',
  templateUrl: './character-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterListAltComponent  {
  pageTitle = 'Character';

  //Observable de acción para el manejo de errores
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();



  //observable que emite todos los productos
  characters$ = this.characterService.characterWithType$
  .pipe(catchError(err => {
    this.errorMessageSubject.next(err);
    return EMPTY
  }));


  //observable que emite el producto seleccionado
  selectedCharacter$ = this.characterService.selectedCharacter$;




  constructor(private characterService: CharacterService) { }




  onSelected(characterId: number): void {
   this.characterService.selectedCharacterChanged(characterId);
  }
}
