import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/models/task';

@Pipe({
  name: 'taskFilter'
})
export class TaskFilterPipe implements PipeTransform {

  transform(tasks: Task[], filter: string): Task[] {
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
