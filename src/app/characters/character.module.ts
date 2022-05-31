import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CharacterShellComponent } from './character-list-alt/product-shell.component';
import { CharacterDetailComponent } from './character-list-alt/character-detail.component';

import { SharedModule } from '../shared/shared.module';
import { CharacterListAltComponent } from './character-list-alt/character-list-alt.component';
import { CharacterListComponent } from './character-list.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CharacterListComponent
      },
      {
        path: 'alternate',
        component: CharacterShellComponent
      }
    ])
  ],
  declarations: [
    CharacterListComponent,
    CharacterShellComponent,
    CharacterListAltComponent,
    CharacterDetailComponent
  ]
})
export class CharacterModule { }
