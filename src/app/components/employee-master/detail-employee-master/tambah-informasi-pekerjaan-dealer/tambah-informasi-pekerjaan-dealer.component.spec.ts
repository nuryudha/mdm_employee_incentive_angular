import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TambahInformasiPekerjaanDealerComponent } from './tambah-informasi-pekerjaan-dealer.component';

describe('TambahInformasiPekerjaanDealerComponent', () => {
  let component: TambahInformasiPekerjaanDealerComponent;
  let fixture: ComponentFixture<TambahInformasiPekerjaanDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TambahInformasiPekerjaanDealerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TambahInformasiPekerjaanDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
