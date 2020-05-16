import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private dbService: NgxIndexedDBService) { }

  async addNewTask(task: Task) {
    const taskToAdd = { ...task };
    delete taskToAdd.id;
    const taskId = await this.dbService.add('tasks', taskToAdd);
    console.log(taskId);
  }

  async getAllTasksByDate(date: number) {
    const tasks: Task[] = [];
    await this.dbService.openCursorByIndex('tasks', 'dueDate', IDBKeyRange.only(date), (evt) => {
      const cursor = (<any>evt.target).result;
      if (cursor) {
        tasks.push(cursor.value);
        cursor.continue();
      }
    });
    return tasks;
  }
}
