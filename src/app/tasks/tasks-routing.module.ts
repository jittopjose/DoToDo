import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksPage } from './tasks.page';

const routes: Routes = [
  {
    path: '',
    component: TasksPage,
  },
  {
    path: 'task-create-edit/:taskId',
    loadChildren: () => import('./task-create-edit/task-create-edit.module').then( m => m.TaskCreateEditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
