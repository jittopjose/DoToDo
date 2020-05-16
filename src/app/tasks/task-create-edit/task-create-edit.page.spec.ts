import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskCreateEditPage } from './task-create-edit.page';

describe('TaskCreateEditPage', () => {
  let component: TaskCreateEditPage;
  let fixture: ComponentFixture<TaskCreateEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCreateEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreateEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
