import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSchedulingComponent } from './task-scheduling.component';

describe('TaskSchedulingComponent', () => {
  let component: TaskSchedulingComponent;
  let fixture: ComponentFixture<TaskSchedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskSchedulingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
