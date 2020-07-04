import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandableComponent } from 'src/app/tasks/expandable/expandable.component';



@NgModule({
  declarations: [
    ExpandableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ExpandableComponent
  ]
})
export class SharedModule { }
