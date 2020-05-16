import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskCreateEditPage } from './task-create-edit.page';

const routes: Routes = [
  {
    path: '',
    component: TaskCreateEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskCreateEditPageRoutingModule {}
