import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TasksPage } from './tasks.page';

import { HomePageRoutingModule } from './tasks-routing.module';
import { TaskAddQuickComponent } from './task-add-quick/task-add-quick.component';
import { TaskOpenCloseConfirmComponent } from './task-open-close-confirm/task-open-close-confirm.component';
import { TaskFilterPipe } from '../shared/pipes/task-filter.pipe';
import { TaskStatusDisplayPipe } from '../shared/pipes/task-status-display.pipe';
import { TaskDetailDisplayPipe } from '../shared/pipes/task-detail-display.pipe';
import { NotificationsComponent } from './notifications/notifications.component';
import { CreateTaskTypeComponent } from './create-task-type/create-task-type.component';



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
    TaskOpenCloseConfirmComponent,
    NotificationsComponent,
    CreateTaskTypeComponent,
    TaskFilterPipe,
    TaskStatusDisplayPipe,
    TaskDetailDisplayPipe
  ]
})
export class HomePageModule {}
