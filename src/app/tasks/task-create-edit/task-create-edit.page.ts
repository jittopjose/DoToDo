import { Component, OnInit } from '@angular/core';

import * as icons from '../../constants/icons';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-create-edit.page.html',
  styleUrls: ['./task-create-edit.page.scss'],
})
export class TaskCreateEditPage implements OnInit {
  backButtonIcon = icons.ionIcons.arrowBackOutline;
  constructor() { }

  ngOnInit() {
  }

}
