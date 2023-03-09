import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEmployeeIncentiveComponent } from './data-employee-incentive.component';

describe('DataEmployeeIncentiveComponent', () => {
  let component: DataEmployeeIncentiveComponent;
  let fixture: ComponentFixture<DataEmployeeIncentiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataEmployeeIncentiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEmployeeIncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
