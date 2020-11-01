import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandableComponent } from 'src/app/tasks/expandable/expandable.component';
import { DateProxyPipe } from '../pipes/date-proxy.pipe';



@NgModule({
  declarations: [
    ExpandableComponent,
    DateProxyPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ExpandableComponent,
    DateProxyPipe
  ]
})
export class SharedModule { }
