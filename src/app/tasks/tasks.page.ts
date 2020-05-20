import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, AlertController, PopoverController } from '@ionic/angular';

import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { CreateTaskTypeComponent } from './create-task-type/create-task-type.component';
import { TaskAddQuickComponent } from './task-add-quick/task-add-quick.component';
import { Task } from '../models/task';
import { convertYYYYMMDD, getDateTitle } from '../utilities/utility';
import * as icons from '../constants/icons';
import { presentAlertConfirm } from '../ion-components/alert';
import { presentPopover } from '../ion-components/popover';
import { SettingService } from '../services/setting.service';
import { Setting } from '../models/setting';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss'],
})
export class TasksPage implements OnInit {
  toolbarText = '';
  segmentValue = 'active';
  settingsIcon = icons.ionIcons.settingsOutline;
  addTaskIcon = icons.ionIcons.addOutline;
  closeIcon = icons.ionIcons.close;
  editIcon = icons.ionIcons.createOutline;
  deleteIcon = icons.ionIcons.trashOutline;
  prevDayIcon = icons.ionIcons.chevronBackOutline;
  nextDayIcon = icons.ionIcons.chevronForwardOutline;
  reopenIcon = icons.ionIcons.lockOpenOutline;
  markAsDoneIcon = icons.ionIcons.checkmarkDoneOutline;
  loadedTasks: Task[] = [];
  settings: Setting[] = [];
  loadedDate: number;
  loadedDatetime: Date;
  today = convertYYYYMMDD(new Date());
  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router,
    private taskService: TaskService,
    private settingService: SettingService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.initApp();
    this.settingService.settings
      .subscribe({
        next: (settings: Setting[]) => {
          this.settings = settings;
        }
      });
    this.taskService.tasks
      .subscribe({
        next: (tasks: Task[]) => {
          this.loadedTasks = tasks;
        }
      });
    this.taskService.loadedDateTime.subscribe({
      next: (dateTime) => {
        this.loadedDatetime = dateTime;
        this.loadedDate = +convertYYYYMMDD(this.loadedDatetime);
        this.toolbarText = getDateTitle(this.loadedDatetime);
        this.loadTasks();
      }
    });
  }

  async initApp() {
    await this.settingService.loadSettings();
    let taskSchedulerRunDateSetting = await this.settingService.getSetting('taskSchedulerRunDate');
    if (taskSchedulerRunDateSetting === undefined || taskSchedulerRunDateSetting.value !== this.today) {
      const newTaskCreated = await this.taskService.executeDailyTaskSchedule();
      if (newTaskCreated) {
        await this.loadTasks();
      }
      if (taskSchedulerRunDateSetting === undefined) {
        taskSchedulerRunDateSetting = {
          id: -1,
          name: 'taskSchedulerRunDate',
          value: this.today
        }
        await this.settingService.addSetting(taskSchedulerRunDateSetting);
      } else {
        taskSchedulerRunDateSetting.value = this.today;
        await this.settingService.updateSetting(taskSchedulerRunDateSetting);
      }
    }
    let pendingTaskCopyRunDateSetting = await this.settingService.getSetting('pendingTaskCopyRunDate');
    if (pendingTaskCopyRunDateSetting === undefined || pendingTaskCopyRunDateSetting.value !== this.today) {
      const pendingTasks = await this.taskService.getPendingTasks();
      if (pendingTasks.length > 0) {
        const confirm = await presentAlertConfirm(this.alertController, 'You have unfinished tasks. Do you want to copy them to this day?',
          'Copy Tasks', 'Ignore', 'Copy', '320px', []);
        if (confirm.result) {
          for (const task of pendingTasks) {
            task.dueDateTime = new Date(task.dueDateTime.setDate(task.dueDateTime.getDate() + 1));
            task.dueDate = +convertYYYYMMDD(task.dueDateTime);
            task.refTaskId = -1;
            await this.taskService.addNewTask(task, this.loadedDate);
          }
        }
      }
      if (pendingTaskCopyRunDateSetting === undefined) {
        pendingTaskCopyRunDateSetting = {
          id: -1,
          name: 'pendingTaskCopyRunDate',
          value: this.today
        }
        await this.settingService.addSetting(pendingTaskCopyRunDateSetting);
      } else {
        pendingTaskCopyRunDateSetting.value = this.today;
        await this.settingService.updateSetting(pendingTaskCopyRunDateSetting);
      }
    }
  }

  ionViewWillEnter() {
    this.loadTasks();
  }

  async loadTasks() {
    await this.taskService.getAllTasksByDate(this.loadedDate)
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }

  onTaskSelect(task: Task) {
    this.presentActionSheet(task);
  }

  async presentActionSheet(task: Task) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Task',
      buttons: [
        {
          text: task.done ? 'Reopen Task' : 'Mark As Done',
          icon: task.done ? this.reopenIcon : this.markAsDoneIcon,
          handler: () => {
            this.onToggleDone(task);
          }
        },
        {
          text: 'Edit Task',
          icon: this.editIcon,
          handler: () => {
            this.router.navigate(['/', 'tasks', 'task-create-edit', task.id]);
          }
        },
        {
          text: 'Delete Task',
          icon: this.deleteIcon,
          handler: () => {
            this.deleteTask(task.id);
          }
        },
        {
          text: 'Cancel',
          icon: this.closeIcon,
          role: 'cancel'
        }]
    });
    await actionSheet.present();
  }

  async onCreateNewTaskTypeSelect(event) {
    const { data } = await presentPopover(this.popoverController, event, CreateTaskTypeComponent);
    if (data) {
      if (data.taskType === 'quick') {
        this.presentCreateNewQuickTaskModal();
      } else if (data.taskType === 'advanced') {
        this.router.navigate(['/', 'tasks', 'task-create-edit', 'new']);
      }
    }
  }


  async presentCreateNewQuickTaskModal() {
    const modal = await this.modalController.create({
      component: TaskAddQuickComponent
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data !== null) {
      await this.createQuickTask(data.name, data.dueDate);
    }
  }

  async createQuickTask(name: string, dueDate: string) {
    const task: Task = {
      id: -1,
      name: name,
      remarks: '',
      done: false,
      dueDateTime: new Date(dueDate),
      dueDate: +convertYYYYMMDD(dueDate),
      list: 'Personal',
      repeat: 'no-repeat',
      refTaskId: -1
    }
    await this.taskService.addNewTask(task, this.loadedDate);
  }

  loadPreviousDay() {
    this.taskService.setLoadedDateTime(new Date(this.loadedDatetime.setDate(this.loadedDatetime.getDate() - 1)));
  }

  loadNextDay() {
    this.taskService.setLoadedDateTime(new Date(this.loadedDatetime.setDate(this.loadedDatetime.getDate() + 1)));
  }

  async onToggleDone(task: Task) {

    const confirm = await presentAlertConfirm(this.alertController, '',
      'Are you sure?', 'Cancel', task.done ? 'Reopen' : 'Finish', '320px',
      [{ name: 'comment', type: 'text', placeholder: 'Add a comment..' }]);
    if (confirm.result) {
      task.done = !task.done;
      if (task.done) {
        task.remarks = confirm.data.comment === '' ? 'Marked as done' : confirm.data.comment;
      }
      else {
        task.remarks = confirm.data.comment === '' ? 'Marked as reopened' : confirm.data.comment;
      }
      this.taskService.updateTaskDone(task);
    }
  }

  async deleteTask(taskId) {
    const confirm = await presentAlertConfirm(this.alertController, 'Are you sure you want to delete the task?',
      'Are you sure?', 'Cancel', 'Okay', null, []);
    if (confirm.result) {
      await this.taskService.deleteTask(taskId);
    }
  }
}
