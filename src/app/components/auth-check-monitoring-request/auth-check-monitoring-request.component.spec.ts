import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCheckMonitoringRequestComponent } from './auth-check-monitoring-request.component';

describe('AuthCheckMonitoringRequestComponent', () => {
  let component: AuthCheckMonitoringRequestComponent;
  let fixture: ComponentFixture<AuthCheckMonitoringRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCheckMonitoringRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCheckMonitoringRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
