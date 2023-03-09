import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCheckViewDetailEmployeeComponent } from './auth-check-view-detail-employee.component';

describe('AuthCheckViewDetailEmployeeComponent', () => {
  let component: AuthCheckViewDetailEmployeeComponent;
  let fixture: ComponentFixture<AuthCheckViewDetailEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCheckViewDetailEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCheckViewDetailEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
