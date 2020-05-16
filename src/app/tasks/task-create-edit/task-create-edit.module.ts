import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskCreateEditPageRoutingModule } from './task-create-edit-routing.module';

import { TaskCreateEditPage } from './task-create-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskCreateEditPageRoutingModule
  ],
  declarations: [TaskCreateEditPage]
})
export class TaskCreateEditPageModule {}
