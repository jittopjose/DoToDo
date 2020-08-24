import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Task } from 'src/app/models/task';

@Pipe({
  name: 'checklistSummaryDisplay'
})
export class ChecklistSummaryDisplayPipe implements PipeTransform {
  constructor(private translate: TranslateService) { }

  transform(checklist: Task, lastUpdatedTime: number): string {
    const checklistSummary = '';
    if(checklist.detail.checklistItems) {
      const totalItems = checklist.detail.checklistItems.length;
      let doneItems = 0;
      for(const item of checklist.detail.checklistItems) {
        if(item.done) {
          doneItems++;
        }
      }
      return this.translate.instant('CHECKLISTS.checklist_summary_text', {doneCount: doneItems, totalCount: totalItems});
    }
    return checklistSummary;
  }

}
