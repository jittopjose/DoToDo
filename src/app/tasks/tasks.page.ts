import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { CreateTaskTypeComponent } from './create-task-type/create-task-type.component';
import { TaskAddQuickComponent } from './task-add-quick/task-add-quick.component';
import { Task } from '../models/task';
import { convertYYYYMMDD, getDateTitle } from '../utilities/utility';
import * as icons from '../constants/icons';
import { presentAlertConfirm } from '../ion-components/alert';

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

  ionViewWillEnter() {
    this.loadTasks();
  }

  async loadTasks() {
    await this.taskService.getAllTasksByDate(this.loadedDate)
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }

  onTaskSelect(taskId: string) {
    this.presentActionSheet(taskId);
  }

  async presentActionSheet(taskId) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Task',
      buttons: [{
        text: 'Edit Task',
        icon: this.editIcon,
        handler: () => {
          this.router.navigate(['/', 'tasks', 'task-create-edit', taskId]);
        }
      },
      {
        text: 'Delete Task',
        icon: this.deleteIcon,
        handler: () => {
          this.deleteTask(+taskId);
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

  onCreateNewTaskTypeSelect(event) {
    this.presentCreateNewTaskTypePopover(event).then(
      result => {
        if (result.data) {
          if (result.data.taskType === 'quick') {
            this.presentCreateNewQuickTaskModal();
          } else if (result.data.taskType === 'advanced') {

          }
        }
      }
    );

  }

  async presentCreateNewTaskTypePopover(event: any) {
    const popover = await this.popoverController.create({
      component: CreateTaskTypeComponent,
      event: event,
      translucent: true
    });
    await popover.present();
    return popover.onWillDismiss();
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
      dueDate: +convertYYYYMMDD(dueDate)
    }
    await this.taskService.addNewTask(task, this.loadedDate);
  }

  loadPreviousDay() {
    this.taskService.setLoadedDateTime(new Date(this.loadedDatetime.setDate(this.loadedDatetime.getDate() - 1)));
  }

  loadNextDay() {
    this.taskService.setLoadedDateTime(new Date(this.loadedDatetime.setDate(this.loadedDatetime.getDate() + 1)));
  }

  onToggleDone(task: Task, event) {
    task.done = event.detail.checked;
    if (task.done) {
      task.remarks = 'Marked as done';
    }
    else {
      task.remarks = 'Marked as undone';
    }
    this.taskService.updateTask(task);
  }

  async deleteTask(taskId) {
    const confirm = await presentAlertConfirm(this.alertController, 'Are you sure you want to delete the task?');
    if (confirm) {
      await this.taskService.deleteTask(taskId);
    }
  }
}
