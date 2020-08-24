import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChecklistsPageRoutingModule } from './checklists-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { ChecklistsPage } from './checklists.page';
import { ChecklistStatusDisplayPipe } from '../../shared/pipes/checklist-status-display.pipe';
import { ChecklistSummaryDisplayPipe } from '../../shared/pipes/checklist-summary-display.pipe';
import { SharedModule } from '../../shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChecklistsPageRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [
    ChecklistsPage,
    ChecklistStatusDisplayPipe,
    ChecklistSummaryDisplayPipe
  ]
})
export class ChecklistsPageModule {}
