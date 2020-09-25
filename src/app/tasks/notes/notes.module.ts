import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { NotesPageRoutingModule } from './notes-routing.module';

import { NotesPage } from './notes.page';
import { SharedModule } from '../../shared/shared/shared.module';
import { DateProxyPipe } from 'src/app/shared/pipes/date-proxy.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesPageRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [
    NotesPage
  ],
  providers: [
    DatePipe,
    DateProxyPipe
  ]
})
export class NotesPageModule {}
