import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Task } from '../models/task';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private _tasks = new BehaviorSubject<Task[]>([]);
  private _loadedDateTime = new BehaviorSubject<Date>(new Date());

  constructor(private dbService: NgxIndexedDBService) { }

  get tasks() {
    return this._tasks.asObservable();
  }

  get loadedDateTime() {
    return this._loadedDateTime.asObservable();
  }

  setLoadedDateTime(date: Date) {
    this._loadedDateTime.next(date);
  }

  async addNewTask(task: Task, loadedDate: number) {
    const taskToAdd = { ...task };
    delete taskToAdd.id;
    const taskId = await this.dbService.add('tasks', taskToAdd);
    if (taskToAdd.dueDate === loadedDate) {
      task.id = taskId;
      const tasks = this._tasks.value;
      this._tasks.next(tasks.concat(task));
    }
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
    this._tasks.next(tasks);
  }

  async updateTask(task: Task) {
    const taskToUpdate = { ...task };
    await this.dbService.update('tasks', taskToUpdate);
  }

  async deleteTask(taskId: number) {
    await this.dbService.delete('tasks', taskId);
    const tasks = this._tasks.value.filter(t => t.id !== taskId);
    this._tasks.next(tasks);

  }
}
