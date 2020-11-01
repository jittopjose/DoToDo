import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import * as icons from '../../constants/icons';
import { NgForm } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-task-add-quick',
  templateUrl: './task-add-quick.component.html',
  styleUrls: ['./task-add-quick.component.scss'],
})
export class TaskAddQuickComponent implements OnInit {
  closeIcon = icons.ionIcons.closeOutline;
  today = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
  dayShortNames = [];
  monthShortNames = [];
  dateDisplayFormat = 'DDD MMM DD, YYYY';
  constructor(
    private modalController: ModalController,
    private taskService: TaskService,
    private translate: TranslateService
    ) { }

  ngOnInit() {
    this.dayShortNames = this.translate.instant('COMMON.day_short_names');
    this.monthShortNames = this.translate.instant('COMMON.month_short_names');
    this.dateDisplayFormat = this.translate.instant('COMMON.date_display_format');
    this.today = new Date(this.taskService.loadedDateTimeCurrentValue.setHours(23, 59, 59, 999)).toISOString();
  }

  onCancel() {
    this.modalController.dismiss(null);
  }

  onAddQuickTask(quickTaskAddForm: NgForm) {
    if (quickTaskAddForm.valid) {
      this.modalController.dismiss({
        name: quickTaskAddForm.value.name,
        dueDate: quickTaskAddForm.value.dueDate
      });
    }
  }
}
