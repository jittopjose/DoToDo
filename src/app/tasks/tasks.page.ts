import { Component } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import * as icons from '../constants/icons';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { CreateTaskTypeComponent } from './create-task-type/create-task-type.component';
import { TaskAddQuickComponent } from './task-add-quick/task-add-quick.component';
import { Task } from '../models/task';
import { convertYYYYMMDD } from '../utilities/utility';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss'],
})
export class TasksPage {
  toolbarText = 'Today';
  settingsIcon = icons.ionIcons.settingsOutline;
  addTaskIcon = icons.ionIcons.addOutline;
  closeIcon = icons.ionIcons.close;
  editTaskIcon = icons.ionIcons.createOutline;
  loadedTasks:Task[] = [];
  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router,
    private taskService: TaskService,
    private popoverController: PopoverController,
    private modalController: ModalController
  ) { }

  ionViewWillEnter() {
    this.loadTasks();
  }

  async loadTasks() {
    const tasks = await this.taskService.getAllTasksByDate(20200516);
    this.loadedTasks = tasks;
    console.log(this.loadedTasks);
  }

  segmentChanged(event: any) {
    //event.detail.value
    console.log(event.type);
  }

  onTaskSelect(taskId: string) {
    this.presentActionSheet(taskId);
  }

  async presentActionSheet(taskId) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Task',
      buttons: [{
        text: 'Edit Task',
        icon: this.editTaskIcon,
        handler: () => {
          this.router.navigate(['/', 'tasks', 'task-create-edit', taskId]);
        }
      }, {
        text: 'Cancel',
        icon: this.closeIcon,
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  onCreateNewTaskTypeSelect(event) {
    this.taskService.getAllTasksByDate(20200516);
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
    await this.taskService.addNewTask(task);
  }
}
