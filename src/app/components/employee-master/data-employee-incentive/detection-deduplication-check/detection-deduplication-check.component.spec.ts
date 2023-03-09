import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionDeduplicationCheckComponent } from './detection-deduplication-check.component';

describe('DetectionDeduplicationCheckComponent', () => {
  let component: DetectionDeduplicationCheckComponent;
  let fixture: ComponentFixture<DetectionDeduplicationCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetectionDeduplicationCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectionDeduplicationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
