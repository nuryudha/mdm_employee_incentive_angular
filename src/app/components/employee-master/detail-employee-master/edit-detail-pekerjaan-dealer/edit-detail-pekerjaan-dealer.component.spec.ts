import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDetailPekerjaanDealerComponent } from './edit-detail-pekerjaan-dealer.component';

describe('EditDetailPekerjaanDealerComponent', () => {
  let component: EditDetailPekerjaanDealerComponent;
  let fixture: ComponentFixture<EditDetailPekerjaanDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDetailPekerjaanDealerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDetailPekerjaanDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
