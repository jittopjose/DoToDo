import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonInput } from '@ionic/angular';
import * as icons from '../../constants/icons';
import { Task } from '../../models/task';
import { NgForm } from '@angular/forms';
import { convertYYYYMMDD } from '../../utilities/utility';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-checklist-create-edit',
  templateUrl: './checklist-create-edit.page.html',
  styleUrls: ['./checklist-create-edit.page.scss'],
})
export class ChecklistCreateEditPage implements OnInit {
  @ViewChild('checklistAddEditForm', { static: true }) checklistAddEditForm: NgForm;
  @ViewChild('checklistItemRef') checklistItemRef: IonInput;
  backButtonIcon = icons.ionIcons.arrowBackOutline;
  addChecklistItemIcon = icons.ionIcons.addOutline;
  deleteChecklistItemIcon = icons.ionIcons.closeOutline;
  titleText = 'Add New Checklist';
  checklist: Task;
  checklistItem: string;
  checklistItemArray = [];
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (param) => {
        if (!param.get('checklistId')) {
          this.navController.navigateBack('/tasks');
          return;
        }
        if (param.get('checklistId') === 'new') {

        } else {
          this.getChecklist(param.get('checklistId'));
        }

      }
    });
  }

  onAddChecklistItem() {
    if (this.checklistItem !== undefined && this.checklistItem.trim() !== '') {
      this.checklistItemArray.push({ name: this.checklistItem, done: false });
      this.checklistItem = '';
      this.checklistItemRef.setFocus();
    }
  }

  onDeleteChecklistItem(index) {
    this.checklistItemArray.splice(index, 1);
  }

  async onAddEditChecklist() {
    if (this.checklistAddEditForm.valid) {
      if (this.checklist === undefined) {
        const checklist: Task = {
          id: -1,
          name: this.checklistAddEditForm.value.name,
          remarks: '',
          done: false,
          dueDateTime: new Date(),
          dueDate: +convertYYYYMMDD(new Date()),
          list: 'Personal',
          repeat: '',
          repeating: 'false',
          refTaskId: -999,
          type: 'checklist',
          detail: {
            checklistItems: this.checklistItemArray
          }
        }
        await this.taskService.addNewChecklist(checklist);
      } else {
        this.checklist.name = this.checklistAddEditForm.value.name;
        this.checklist.detail.checklistItems = this.checklistItemArray;
        await this.taskService.updateChecklist(this.checklist);
      }
      this.navController.navigateBack('/tasks/checklists');
    }
  }

  async getChecklist(checklistId) {
    this.checklist = await this.taskService.getChecklistById(checklistId);
    if (this.checklist === undefined) {
      this.navController.navigateBack('/tasks/checklists');
      return;
    }
    this.checklistItemArray = this.checklist.detail.checklistItems;
    this.titleText = 'Edit Task';
  }


}
