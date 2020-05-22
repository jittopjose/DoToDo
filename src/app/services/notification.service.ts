import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { convertYYYYMMDD } from '../utilities/utility';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = new BehaviorSubject<Notification[]>([]);

  constructor(private dbService: NgxIndexedDBService) { }

  get notifications() {
    return this._notifications.asObservable();
  }

  async loadInitNotificationsSummary() {
    await this.dbService.clear('notifications');
    const yesterdayStr = +convertYYYYMMDD(new Date().setDate(new Date().getDate() - 1));
    let overdueCount = 0;
    const tasksFromDb: Task[] = await this.dbService
      .getAllByIndex('tasks', 'dueDate', IDBKeyRange.only(yesterdayStr));
    for (const task of tasksFromDb) {
      if (!task.done) {
        overdueCount++;
      }
    }
    if (overdueCount > 0) {
      const notification: Notification = {
        id: -1,
        text: `You had ${overdueCount} unfinished task(s) yesterday`,
        active: 'true'
      }
      delete notification.id;
      await this.dbService.add('notifications', notification);
    }
  }

  async reloadNotifications() {
    const todayStr = +convertYYYYMMDD(new Date());
    const notifications: Notification[] = await this.dbService.getAll('notifications');
    const tasks: Task[] = await this.dbService
      .getAllByIndex('tasks', 'dueDate', IDBKeyRange.only(todayStr));
    for (const task of tasks) {
      if (!task.done) {
        const notificationText = this.getTaskDueNotificationText(task);
        if (notificationText !== '') {
          if (notifications.findIndex(n => n.text === notificationText) < 0) {
            const notification: Notification = {
              id: -1,
              text: notificationText,
              active: 'true'
            }
            delete notification.id;
            const id = await this.dbService.add('notifications', notification);
            notification.id = id;
            notifications.push(notification);
          }
        }
      }
    }
    const activeNotifications: Notification[] = await this.dbService
      .getAllByIndex('notifications', 'active', IDBKeyRange.only('true'));
    this._notifications.next(activeNotifications);
  }

  getTaskDueNotificationText(task: Task) {
    const minutesNow = new Date().getTime() / 1000 / 60;
    const minutesTaskDue = task.dueDateTime.getTime() / 1000 / 60;
    if (minutesTaskDue > minutesNow) {
      if ((minutesTaskDue - minutesNow) < 60) {
        return `Task: "${task.name}" is due in ${Math.floor(minutesTaskDue - minutesNow)} min.`;
      }
    } else {
      return `Task: "${task.name}" is overdue`;
    }
    return '';
  }

  async deactivateAllNotifications() {
    const activeNotifications: Notification[] = await this.dbService
      .getAllByIndex('notifications', 'active', IDBKeyRange.only('true'));

    for(const notification of activeNotifications) {
      notification.active = 'false';
      await this.dbService.update('notifications', notification);
    }
    this._notifications.next([]);
  }

}
