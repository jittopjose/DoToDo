import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesPageRoutingModule } from './notes-routing.module';
import { ExpandableComponent } from '../expandable/expandable.component';

import { NotesPage } from './notes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesPageRoutingModule
  ],
  declarations: [
    NotesPage,
    ExpandableComponent
  ]
})
export class NotesPageModule {}
