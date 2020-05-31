import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChecklistCreateEditPage } from './checklist-create-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ChecklistCreateEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChecklistCreateEditPageRoutingModule {}
