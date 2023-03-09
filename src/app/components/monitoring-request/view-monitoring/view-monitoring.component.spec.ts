import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMonitoringComponent } from './view-monitoring.component';

describe('ViewMonitoringComponent', () => {
  let component: ViewMonitoringComponent;
  let fixture: ComponentFixture<ViewMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
