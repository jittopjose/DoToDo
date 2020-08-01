import { Pipe, PipeTransform } from '@angular/core';
import { TaskForDisplay } from 'src/app/models/task';

@Pipe({
  name: 'taskFilter'
})
export class TaskFilterPipe implements PipeTransform {

  transform(tasks: TaskForDisplay[], filter: string): TaskForDisplay[] {
    if (!tasks || !filter) {
      return tasks;
    }
    switch(filter){
      case 'all' : { return tasks }
      case 'done' : { return tasks.filter(t => t.done) }
      case 'pending' : { return tasks.filter(t => !t.done)}
      default: {return tasks}
    }
  }

}
