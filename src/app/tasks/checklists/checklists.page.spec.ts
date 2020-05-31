import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChecklistsPage } from './checklists.page';

describe('ChecklistsPage', () => {
  let component: ChecklistsPage;
  let fixture: ComponentFixture<ChecklistsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChecklistsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
