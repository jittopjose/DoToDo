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
import { TaskOpenCloseConfirmComponent } from './task-open-close-confirm/task-open-close-confirm.component';

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
  loadedDate: number;
  loadedDatetime: Date;
  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router,
    private taskService: TaskService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    console.log('init');
    this.initTaskSchedules();
    this.taskService.tasks
      .subscribe({
        next: (tasks: Task[]) => {
          this.loadedTasks = tasks;
        }
      })
    this.taskService.loadedDateTime.subscribe({
      next: (dateTime) => {
        this.loadedDatetime = dateTime;
        this.loadedDate = +convertYYYYMMDD(this.loadedDatetime);
        this.toolbarText = getDateTitle(this.loadedDatetime);
        this.loadTasks();
      }
    });
  }

  async initTaskSchedules() {
    const newTaskCreated = await this.taskService.executeDailyTaskSchedule();
    if (newTaskCreated) {
      await this.loadTasks();
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
    const mode = task.done ? 'reopen' : 'done';
    const { data } = await presentPopover(this.popoverController, null, TaskOpenCloseConfirmComponent, { mode }, '320px');
    if (data !== null && data !== undefined) {
      task.done = !task.done;
      if (task.done) {
        task.remarks = data.remarks === '' ? 'Marked as done' : data.remarks;
      }
      else {
        task.remarks = data.remarks === '' ? 'Marked as reopened' : data.remarks;
      }
      this.taskService.updateTaskDone(task);
    }
    else {
      return;
    }
  }

  async deleteTask(taskId) {
    const confirm = await presentAlertConfirm(this.alertController, 'Are you sure you want to delete the task?');
    if (confirm) {
      await this.taskService.deleteTask(taskId);
    }
  }
}
