import { TestBed } from '@angular/core/testing';

import { ToggleLoadingService } from './toggle-loading.service';

describe('ToggleLoadingService', () => {
  let service: ToggleLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
