import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChecklistCreateEditPage } from './checklist-create-edit.page';

describe('ChecklistCreateEditPage', () => {
  let component: ChecklistCreateEditPage;
  let fixture: ComponentFixture<ChecklistCreateEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistCreateEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChecklistCreateEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
