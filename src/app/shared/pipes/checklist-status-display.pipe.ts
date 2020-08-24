import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Task } from '../../models/task';

@Pipe({
  name: 'checklistStatusDisplay'
})
export class ChecklistStatusDisplayPipe implements PipeTransform {

  constructor(private translate: TranslateService) { }

  transform(checklist: Task, lastUpdatedTime: number): string {
    if (checklist.done) {
      return this.translate.instant('CHECKLISTS.checklist_status_done');
    } else {
      for(const item of checklist.detail.checklistItems) {
        if(item.done) {
          return this.translate.instant('CHECKLISTS.checklist_status_inprogress');
        }
      }
      return this.translate.instant('CHECKLISTS.checklist_status_pending');
    }

  }

}
