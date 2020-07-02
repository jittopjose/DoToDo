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
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'checklists',
    loadChildren: () => import('./checklists/checklists.module').then( m => m.ChecklistsPageModule)
  },
  {
    path: 'checklist-create-edit/:checklistId',
    loadChildren: () => import('./checklist-create-edit/checklist-create-edit.module').then( m => m.ChecklistCreateEditPageModule)
  },
  {
    path: 'notes',
    loadChildren: () => import('./notes/notes.module').then( m => m.NotesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
