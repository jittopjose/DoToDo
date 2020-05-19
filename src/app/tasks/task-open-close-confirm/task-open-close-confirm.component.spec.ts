import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskOpenCloseConfirmComponent } from './task-open-close-confirm.component';

describe('TaskCloseConfirmComponent', () => {
  let component: TaskOpenCloseConfirmComponent;
  let fixture: ComponentFixture<TaskOpenCloseConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskOpenCloseConfirmComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskOpenCloseConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
