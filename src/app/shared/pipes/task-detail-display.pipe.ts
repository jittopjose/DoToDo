import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/models/task';
import { convertYYYYMMDD } from 'src/app/utilities/utility';

@Pipe({
  name: 'taskDetailDisplay'
})
export class TaskDetailDisplayPipe implements PipeTransform {

  transform(task: Task, minutesNow: number): string {
    //const minutesNow = new Date().getTime() / 1000/ 60;
    const minutesTaskDue = task.dueDateTime.getTime() / 1000/ 60;
    const todayStr = +convertYYYYMMDD(new Date());
    const displayString = task.list + this.getRepeatText(task.repeat);
    if(todayStr === task.dueDate && !task.done) {
      return displayString + this.getDueText(minutesNow, minutesTaskDue);
    } else {
      return displayString;
    }
  }

  getDueText(minutesNow: number, minutesTaskDue: number) {
    if(minutesTaskDue > minutesNow) {
      if((minutesTaskDue - minutesNow) < 60 ) {
        return `, Due in ${Math.round(minutesTaskDue - minutesNow)} min.`;
      }else {
        return `, Due in ${Math.round((minutesTaskDue - minutesNow)/60)} hr.`;
      }

    }
    return '';
  }

  getRepeatText(repeat: string) {
    switch(repeat) {
      case 'no-repeat' : return ', No repeat'
      case 'every-day' : return ', Every day'
      case 'every-weekdays' : return ', Every weekdays'
      case 'every-weekends' : return ', Every weekends'
      case '1-week' : return ', Once in a week'
      default : return '';
    }
  }

}
