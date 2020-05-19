import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-task-open-close-confirm',
  templateUrl: './task-open-close-confirm.component.html',
  styleUrls: ['./task-open-close-confirm.component.scss'],
})
export class TaskOpenCloseConfirmComponent implements OnInit {
  @Input() mode:string;
  comment = '';
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }


  onCancel() {
    this.popoverController.dismiss(null);
  }

  onToggleDone() {
    this.popoverController.dismiss({
      remarks: this.comment
    });
  }

}
