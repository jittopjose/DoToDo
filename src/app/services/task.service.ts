import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Task } from '../models/task';
import { BehaviorSubject } from 'rxjs';
import { convertYYYYMMDD, isWeekend } from '../utilities/utility';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private _tasks = new BehaviorSubject<Task[]>([]);
  private _checklists = new BehaviorSubject<Task[]>([]);
  private _loadedDateTime = new BehaviorSubject<Date>(new Date());

  constructor(private dbService: NgxIndexedDBService) { }

  get tasks() {
    return this._tasks.asObservable();
  }

  get checklists() {
    return this._checklists.asObservable();
  }

  get loadedDateTime() {
    return this._loadedDateTime.asObservable();
  }

  setLoadedDateTime(date: Date) {
    this._loadedDateTime.next(date);
  }

  async executeDailyTaskSchedule() {
    const primaryTasks: Task[] = await this.dbService.getAllByIndex('tasks', 'reftaskid-type-repeating', IDBKeyRange.only([-1, 'live', 'true']));
    let newTaskCreated = false;
    for (const task of primaryTasks) {
      const result = await this.processTaskSchedule(task);
      newTaskCreated = newTaskCreated || result;
    }
    return newTaskCreated;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async processTaskSchedule(task: Task) {
    let newTaskCreated = false;
    await this.delay();
    const todayStr = +convertYYYYMMDD(new Date());
    if (task.dueDate < todayStr && task.repeat !== 'no-repeat') {
      const existingTasks = await this.dbService
        .getAllByIndex('tasks', 'duedate-reftaskid-type', IDBKeyRange.only([todayStr, task.id, 'live']));
      if (existingTasks.length === 0) {
        if (this.canCreateNewTask(task)) {
          const newTask = { ...task };
          newTask.refTaskId = task.id;
          newTask.dueDateTime = new Date(new Date().setHours(23, 59, 59, 999));
          newTask.dueDate = +convertYYYYMMDD(newTask.dueDateTime);
          newTask.done = false;
          delete newTask.id;

          await this.dbService.add('tasks', newTask);
          newTaskCreated = true;
        }
      }
    }
    return newTaskCreated;
  }

  canCreateNewTask(task: Task) {
    switch (task.repeat) {
      case 'every-day': { return true }
      case 'every-weekdays': {
        const weekday = !isWeekend(new Date());
        if (weekday) {
          return true;
        } else {
          return false;
        }
      }
      case 'every-weekends': {
        const weekend = isWeekend(new Date());
        if (weekend) {
          return true;
        } else {
          return false;
        }
      }
      case '1-week' : {
        if(task.dueDateTime.getDay() === new Date().getDay()) {
          return true;
        }  else {
          return false;
        }
      }
      default: return false;
    }

  }

  async getPendingTasks() {
    const pendingTasks: Task[] = [];
    const yesterdayStr = +convertYYYYMMDD(new Date().setDate(new Date().getDate() - 1));
    const tasksFromDb: Task[] = await this.dbService
    .getAllByIndex('tasks','duedate-repeat-type', IDBKeyRange.only([yesterdayStr, 'no-repeat', 'live']));
    for(const task of tasksFromDb){
      if(!task.done){
        pendingTasks.push(task);
      }
    }
    return pendingTasks;
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

  async getTaskById(taskId: number) {
    const task: Task = await this.dbService.getByIndex('tasks', 'id-type', IDBKeyRange.only([+taskId, 'live']));
    return task;
  }

  async getAllTasksByDate(date: number) {
    const tasks: Task[] = await this.dbService.getAllByIndex('tasks', 'duedate-type', IDBKeyRange.only([date, 'live']));
    this._tasks.next(tasks);
  }

  async getAllTasksByLoadedDate() {
    const date = +convertYYYYMMDD(this._loadedDateTime.value);
    const tasks: Task[] = await this.dbService.getAllByIndex('tasks', 'duedate-type', IDBKeyRange.only([date, 'live']));
    this._tasks.next(tasks);
  }

  async getAllTasksByIndex(index, value) {
    const tasks: Task[] = [];
    await this.dbService.openCursorByIndex('tasks', index, IDBKeyRange.only(value), (evt) => {
      const cursor = (<any>evt.target).result;
      if (cursor) {
        tasks.push(cursor.value);
        cursor.continue();
      }
    });
    return await tasks;
  }

  async updateTaskDone(task: Task) {
    const taskToUpdate = { ...task };
    await this.dbService.update('tasks', taskToUpdate);
    const tasks = this._tasks.value;
    const index = tasks.findIndex(p => p.id === task.id);
    tasks[index] = taskToUpdate;
    await this._tasks.next(tasks.slice());
  }

  async updateTask(task: Task) {
    const taskToUpdate = { ...task };
    if (task.refTaskId >= 0) {
      const refTask: Task = await this.dbService.getByID('tasks', +task.refTaskId);
      refTask.refTaskId = -2;
      this.dbService.update('tasks', refTask);
      taskToUpdate.refTaskId = -1;
    }
    await this.dbService.update('tasks', taskToUpdate);
  }

  async deleteTask(taskId: number) {
    await this.dbService.delete('tasks', taskId);
    const tasks = this._tasks.value.filter(t => t.id !== taskId);
    this._tasks.next(tasks);

  }

  async addNewChecklist(checklist: Task) {
    const checklistToAdd = { ...checklist };
    delete checklistToAdd.id;
    const checklistId = await this.dbService.add('tasks', checklistToAdd);
    checklist.id = checklistId;
    const checklists = this._checklists.value;
    this._checklists.next(checklists.concat(checklist));
  }

  async getAllChecklists() {
    const checklists: Task[] = await this.dbService.getAllByIndex('tasks', 'type', IDBKeyRange.only('checklist'));
    this._checklists.next([...checklists]);
  }

  async updateChecklist(checklist: Task) {
    await this.dbService.update('tasks', checklist);
  }

  async getChecklistById(checklistId: number) {
    const checklist: Task = await this.dbService.getByIndex('tasks', 'id-type', IDBKeyRange.only([+checklistId, 'checklist']));
    return checklist;
  }

  async deleteChecklist(checklistId: number) {
    await this.dbService.delete('tasks', checklistId);
    const checklist = this._checklists.value.filter(t => t.id !== checklistId);
    this._checklists.next(checklist);

  }
}
