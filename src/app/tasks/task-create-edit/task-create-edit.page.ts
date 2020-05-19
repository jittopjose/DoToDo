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
      const dueDateTime = new Date(new Date(this.taskAddEditForm.value.dueDate).setHours(hours, minutes, 0, 0));
      const taskId = this.task ? this.task.id : -1;
      const remarks = this.task ? this.task.remarks : '';
      const refTaskId = this.task ? this.task.refTaskId : -1
      const task: Task = {
        id: taskId,
        name: this.taskAddEditForm.value.name,
        remarks,
        done: false,
        dueDateTime,
        dueDate: +convertYYYYMMDD(dueDateTime),
        list: this.taskAddEditForm.value.list,
        repeat: this.taskAddEditForm.value.repeat,
        refTaskId
      }
      if (task.id === -1) {
        this.taskService.addNewTask(task, +convertYYYYMMDD(new Date()));
      } else {
        this.taskService.updateTask(task);
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
