import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, map } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';

import { CharacterService } from '../character.service';

@Component({
  selector: 'pm-character-detail',
  templateUrl: './character-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailComponent {
  errorMessage = '';

  character$ = this.characterService.selectedCharacter$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  pageTitle$ = this.character$.pipe(
    map((p) => (p ? `Character Detail for: ${p.name}` : null))
  );

  characterSuppliers$ = this.characterService.selectedCharacterSupplier$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  //para eviatar usar tantas observbales en nuestra plantilla del componente, se pueden unir todos los observables de un componetente en uno solo
  //combinando todos los flujos de datos

  vm$ = combineLatest([
    this.character$,
    this.characterSuppliers$,
    this.pageTitle$,
  ]).pipe(
    filter(([character]) => Boolean(character)),
    map(([character, characterSuppliers, pageTitle]) => ({
      character,
      characterSuppliers,
      pageTitle,
    }))
  );

  constructor(private characterService: CharacterService) {}
}
