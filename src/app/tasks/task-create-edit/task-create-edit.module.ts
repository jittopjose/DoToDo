import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TaskCreateEditPageRoutingModule } from './task-create-edit-routing.module';

import { TaskCreateEditPage } from './task-create-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskCreateEditPageRoutingModule,
    TranslateModule
  ],
  declarations: [TaskCreateEditPage]
})
export class TaskCreateEditPageModule {}
