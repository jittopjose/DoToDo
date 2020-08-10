import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { TasksPage } from './tasks.page';

import { HomePageRoutingModule } from './tasks-routing.module';
import { TaskAddQuickComponent } from './task-add-quick/task-add-quick.component';
import { TaskOpenCloseConfirmComponent } from './task-open-close-confirm/task-open-close-confirm.component';
import { TaskFilterPipe } from '../shared/pipes/task-filter.pipe';
import { TaskStatusDisplayPipe } from '../shared/pipes/task-status-display.pipe';
import { TaskDetailDisplayPipe } from '../shared/pipes/task-detail-display.pipe';
import { NotificationsComponent } from './notifications/notifications.component';
import { CreateTaskTypeComponent } from './create-task-type/create-task-type.component';
import { SharedModule } from '../shared/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
    TranslateModule
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
  ],
  providers: [
    DatePipe
  ]
})
export class HomePageModule {}
