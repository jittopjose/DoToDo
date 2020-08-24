import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ChecklistCreateEditPageRoutingModule } from './checklist-create-edit-routing.module';

import { ChecklistCreateEditPage } from './checklist-create-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChecklistCreateEditPageRoutingModule,
    TranslateModule
  ],
  declarations: [ChecklistCreateEditPage]
})
export class ChecklistCreateEditPageModule {}
