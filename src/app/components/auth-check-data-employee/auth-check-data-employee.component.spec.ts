import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCheckDataEmployeeComponent } from './auth-check-data-employee.component';

describe('AuthCheckDataEmployeeComponent', () => {
  let component: AuthCheckDataEmployeeComponent;
  let fixture: ComponentFixture<AuthCheckDataEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCheckDataEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCheckDataEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
