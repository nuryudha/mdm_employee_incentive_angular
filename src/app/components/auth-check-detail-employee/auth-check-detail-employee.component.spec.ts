import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCheckDetailEmployeeComponent } from './auth-check-detail-employee.component';

describe('AuthCheckDetailEmployeeComponent', () => {
  let component: AuthCheckDetailEmployeeComponent;
  let fixture: ComponentFixture<AuthCheckDetailEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCheckDetailEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCheckDetailEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
