import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/models/task';
import { convertYYYYMMDD } from 'src/app/utilities/utility';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'taskDetailDisplay'
})
export class TaskDetailDisplayPipe implements PipeTransform {

  constructor(private translate: TranslateService) { }

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
        return ', ' + this.translate.instant('TASK_LIST.task_due_in_minute_text', {minuteValue: Math.round(minutesTaskDue - minutesNow)});
      }else {
        return ', ' + this.translate.instant('TASK_LIST.task_due_in_hour_text', {hourValue: Math.round((minutesTaskDue - minutesNow)/60)});
      }

    }
    return '';
  }

  getRepeatText(repeat: string) {
    switch(repeat) {
      case 'no-repeat' : return ', ' + this.translate.instant('TASK_LIST.task_no_repeat')
      case 'every-day' : return ', ' + this.translate.instant('TASK_LIST.task_every_day')
      case 'every-weekdays' : return ', ' + this.translate.instant('TASK_LIST.task_every_weekdays')
      case 'every-weekends' : return ', ' + this.translate.instant('TASK_LIST.task_every_weekends')
      case '1-week' : return ', ' + this.translate.instant('TASK_LIST.task_once_a_week')
      default : return '';
    }
  }

}
