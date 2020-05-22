import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/models/task';
import { convertYYYYMMDD } from 'src/app/utilities/utility';

@Pipe({
  name: 'taskStatusDisplay'
})
export class TaskStatusDisplayPipe implements PipeTransform {

  transform(task: Task): string {
    if (task.done) {
      return 'Done';
    } else {
      const todayStr = +convertYYYYMMDD(new Date());
      if (task.dueDate === todayStr) {
        if (task.dueDateTime.getTime() < new Date().getTime()) {
          return 'Overdue';
        } else {
          return 'Pending';
        }
      } else if (task.dueDate < todayStr) {
        return 'Overdue';

      } else if (task.dueDate > todayStr) {
        return 'Open';
      }
    }
  }

}
