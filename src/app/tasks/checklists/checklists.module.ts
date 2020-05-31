import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChecklistsPageRoutingModule } from './checklists-routing.module';

import { ChecklistsPage } from './checklists.page';
import { ExpandableComponent } from '../expandable/expandable.component';
import { ChecklistStatusDisplayPipe } from 'src/app/shared/pipes/checklist-status-display.pipe';
import { ChecklistSummaryDisplayPipe } from 'src/app/shared/pipes/checklist-summary-display.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChecklistsPageRoutingModule
  ],
  declarations: [
    ChecklistsPage,
    ExpandableComponent,
    ChecklistStatusDisplayPipe,
    ChecklistSummaryDisplayPipe
  ]
})
export class ChecklistsPageModule {}
