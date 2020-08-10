import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/models/task';
import { convertYYYYMMDD } from 'src/app/utilities/utility';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'taskStatusDisplay'
})
export class TaskStatusDisplayPipe implements PipeTransform {

  constructor(private translate: TranslateService) { }

  transform(task: Task): string {
    if (task.done) {
      return this.translate.instant('TASK_LIST.task_status_done');
    } else {
      const todayStr = +convertYYYYMMDD(new Date());
      if (task.dueDate === todayStr) {
        if (task.dueDateTime.getTime() < new Date().getTime()) {
          return this.translate.instant('TASK_LIST.task_status_overdue');
        } else {
          return this.translate.instant('TASK_LIST.task_status_pending');
        }
      } else if (task.dueDate < todayStr) {
        return this.translate.instant('TASK_LIST.task_status_overdue');

      } else if (task.dueDate > todayStr) {
        return this.translate.instant('TASK_LIST.task_status_open');
      }
    }
  }

}
