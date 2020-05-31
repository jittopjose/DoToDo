import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import * as icons from '../../constants/icons';


@Component({
  selector: 'app-create-task-type',
  templateUrl: './create-task-type.component.html',
  styleUrls: ['./create-task-type.component.scss'],
})
export class CreateTaskTypeComponent implements OnInit {
  quickTaskIcon = icons.ionIcons.colorWandOutline;
  advancedTaskIcon = icons.ionIcons.gridOutline;
  checklistIcon = icons.ionIcons.checkboxOutline;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  onSelectTaskType(type) {
    this.popoverController.dismiss({taskType: type});
  }

}
