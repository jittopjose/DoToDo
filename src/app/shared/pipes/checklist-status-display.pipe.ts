import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../models/task';

@Pipe({
  name: 'checklistStatusDisplay'
})
export class ChecklistStatusDisplayPipe implements PipeTransform {

  transform(checklist: Task, lastUpdatedTime: number): string {
    if (checklist.done) {
      return 'Done';
    } else {
      for(const item of checklist.detail.checklistItems) {
        if(item.done) {
          return 'In Progress';
        }
      }
      return 'Pending';
    }

  }

}
