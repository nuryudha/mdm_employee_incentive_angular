import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEmployeeMasterComponent } from './detail-employee-master.component';

describe('DetailEmployeeMasterComponent', () => {
  let component: DetailEmployeeMasterComponent;
  let fixture: ComponentFixture<DetailEmployeeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailEmployeeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
