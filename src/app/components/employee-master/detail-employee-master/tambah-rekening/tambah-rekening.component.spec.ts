import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TambahRekeningComponent } from './tambah-rekening.component';

describe('TambahRekeningComponent', () => {
  let component: TambahRekeningComponent;
  let fixture: ComponentFixture<TambahRekeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TambahRekeningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TambahRekeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
