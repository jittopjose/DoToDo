import { Component, OnInit, ViewChild } from '@angular/core';

import * as icons from '../../constants/icons';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task';
import { NgForm } from '@angular/forms';
import { convertYYYYMMDD } from 'src/app/utilities/utility';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-create-edit.page.html',
  styleUrls: ['./task-create-edit.page.scss'],
})
export class TaskCreateEditPage implements OnInit {
  @ViewChild('taskAddEditForm', { static: true }) taskAddEditForm: NgForm;
  backButtonIcon = icons.ionIcons.arrowBackOutline;

  titleText = 'Add New Task';
  task: Task;
  dueDateTime = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (param) => {
        if (!param.get('taskId')) {
          this.navController.navigateBack('/tasks');
          return;
        }
        if (param.get('taskId') === 'new') {

        } else {
          this.getTask(param.get('taskId'));
        }

      }
    });

  }

  async onAddEditTask() {
    if (this.taskAddEditForm.valid) {
      const hours = new Date(this.taskAddEditForm.value.dueTime).getHours();
      const minutes = new Date(this.taskAddEditForm.value.dueTime).getMinutes();
      const dueDateTime = new Date(new Date(this.taskAddEditForm.value.dueDate).setHours(hours, minutes, 59, 999));
      if (this.task === undefined) {
        const task: Task = {
          id: -1,
          name: this.taskAddEditForm.value.name,
          remarks: '',
          done: false,
          dueDateTime,
          dueDate: +convertYYYYMMDD(dueDateTime),
          list: this.taskAddEditForm.value.list,
          repeat: this.taskAddEditForm.value.repeat,
          repeating: this.taskAddEditForm.value.repeat === 'no-repeat' ? 'false' : 'true',
          refTaskId: -1,
          type: 'live',
          detail: {}
        }
        await this.taskService.addNewTask(task, +convertYYYYMMDD(new Date()));
      } else {
        this.task.dueDateTime = dueDateTime;
        this.task.dueDate = +convertYYYYMMDD(dueDateTime);
        this.task.name = this.taskAddEditForm.value.name;
        this.task.list = this.taskAddEditForm.value.list;
        this.task.repeat = this.taskAddEditForm.value.repeat;
        this.task.repeating = this.taskAddEditForm.value.repeat === 'no-repeat' ? 'false' : 'true';
        await this.taskService.updateTask(this.task);
      }
      this.navController.navigateBack('/tasks');
    }
  }

  async getTask(taskId) {
    this.task = await this.taskService.getTaskById(taskId);
    if (this.task === undefined) {
      this.navController.navigateBack('/tasks');
      return;
    }
    this.dueDateTime = this.task.dueDateTime.toISOString();
    this.titleText = 'Edit Task';
  }

}
