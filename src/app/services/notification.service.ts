import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { convertYYYYMMDD } from '../utilities/utility';
import { Task } from '../models/task';
import { TaskService } from './task.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = new BehaviorSubject<Notification[]>([]);

  constructor(
    private dbService: NgxIndexedDBService,
    private taskService: TaskService,
    private translate: TranslateService) { }

  get notifications() {
    return this._notifications.asObservable();
  }

  async loadInitNotificationsSummary() {
    await this.dbService.clear('notifications');
    const yesterdayStr = +convertYYYYMMDD(new Date().setDate(new Date().getDate() - 1));
    let overdueCount = 0;
    const tasksFromDb: Task[] = await this.dbService
      .getAllByIndex('tasks', 'duedate-type', IDBKeyRange.only([yesterdayStr, 'live']));
    for (const task of tasksFromDb) {
      if (!task.done) {
        overdueCount++;
      }
    }
    if (overdueCount > 0) {
      const notification: Notification = {
        id: -1,
        text: this.translate.instant('NOTIFICATIONS.yesterday_unfinished_task_count_msg', {overdueTasksCount: overdueCount}),
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
      .getAllByIndex('tasks', 'duedate-type', IDBKeyRange.only([todayStr, 'live']));
    for (const task of tasks) {
      if (!task.done) {
        const notificationText = this.getTaskDueNotificationText(task);
        if (notificationText !== undefined) {
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
            this.taskService.getAllTasksByLoadedDate();
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
      if((minutesTaskDue - minutesNow) < 15) {
        return this.translate.instant('NOTIFICATIONS.task_due_in_15min_msg', {taskName: task.name});
      }else if((minutesTaskDue - minutesNow) < 30) {
        return this.translate.instant('NOTIFICATIONS.task_due_in_30min_msg', {taskName: task.name});
      } else if ((minutesTaskDue - minutesNow) < 60) {
        return this.translate.instant('NOTIFICATIONS.task_due_in_1hr_msg', {taskName: task.name});
      }
    } else {
      return this.translate.instant('NOTIFICATIONS.task_overdue_msg', {taskName: task.name});
    }
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
