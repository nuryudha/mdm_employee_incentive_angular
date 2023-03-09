import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMappingRekComponent } from './popup-mapping-rek.component';

describe('PopupMappingRekComponent', () => {
  let component: PopupMappingRekComponent;
  let fixture: ComponentFixture<PopupMappingRekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupMappingRekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupMappingRekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
