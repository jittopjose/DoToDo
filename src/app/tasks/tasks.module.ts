import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TasksPage } from './tasks.page';

import { HomePageRoutingModule } from './tasks-routing.module';
import { TaskAddQuickComponent } from './task-add-quick/task-add-quick.component';
import { TaskOpenCloseConfirmComponent } from './task-open-close-confirm/task-open-close-confirm.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    TasksPage,
    TaskAddQuickComponent,
    TaskOpenCloseConfirmComponent
  ]
})
export class HomePageModule {}
