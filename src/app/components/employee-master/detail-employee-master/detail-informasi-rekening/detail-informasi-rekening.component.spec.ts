import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInformasiRekeningComponent } from './detail-informasi-rekening.component';

describe('DetailInformasiRekeningComponent', () => {
  let component: DetailInformasiRekeningComponent;
  let fixture: ComponentFixture<DetailInformasiRekeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailInformasiRekeningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInformasiRekeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
