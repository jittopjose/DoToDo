import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/models/task';

@Pipe({
  name: 'checklistSummaryDisplay'
})
export class ChecklistSummaryDisplayPipe implements PipeTransform {

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
      return `${doneItems} out of ${totalItems} checklist item(s) are done.`;
    }
    return checklistSummary;
  }

}
