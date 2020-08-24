import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as icons from '../../constants/icons';
import { Task } from '../../models/task';
import { Subscription } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { AlertController } from '@ionic/angular';
import { presentAlertConfirm } from '../../ion-components/alert';

interface  ChecklistForDisplay extends Task {
  expanded: boolean;
}

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.page.html',
  styleUrls: ['./checklists.page.scss'],
})
export class ChecklistsPage implements OnInit {

  backButtonIcon = icons.ionIcons.arrowBackOutline;
  addChecklistIcon = icons.ionIcons.addOutline;
  editChecklistIcon = icons.ionIcons.createOutline;
  deleteChecklistIcon = icons.ionIcons.trashOutline;
  loadedChecklists: ChecklistForDisplay[] = [];
  checklistsSub: Subscription;
  lastUpdatedTime = new Date().getTime();
  constructor(
    private taskService: TaskService,
    private alertController: AlertController,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.checklistsSub = this.taskService.checklists
      .subscribe({
        next: (checklists: ChecklistForDisplay[]) => {
          this.loadedChecklists = checklists.map((checklist) => {
            checklist.expanded = false;
            return checklist;
          });
        }
      });
  }

  ionViewWillEnter() {
    this.loadChecklists();
  }

  async loadChecklists() {
    await this.taskService.getAllChecklists();
  }

  toggleExpandItem(index) {
    this.loadedChecklists[index].expanded = !this.loadedChecklists[index].expanded
  }

  async onChecklistItemUpdate(checklist: ChecklistForDisplay){
    let checklistStatus = true;
    for(const item of checklist.detail.checklistItems){
      if(!item.done){
        checklistStatus = false;
        break;
      }
    }
    checklist.done = checklistStatus;
    const checklistToUpdate = {...checklist};
    this.lastUpdatedTime = new Date().getTime();
    delete checklistToUpdate.expanded;
    await this.taskService.updateChecklist(checklistToUpdate);
  }

  async onDeleteChecklist(checklistId) {
    const confirm = await presentAlertConfirm(this.alertController,
    this.translate.instant('CHECKLISTS.delete_checklist_confirm_msg'),
    this.translate.instant('CHECKLISTS.delete_checklist_confirm_header'),
    this.translate.instant('CHECKLISTS.cancel'),
    this.translate.instant('CHECKLISTS.okay'), null, []);
    if (confirm.result) {
      await this.taskService.deleteChecklist(checklistId);
    }
  }

}
