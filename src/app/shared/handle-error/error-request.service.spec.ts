import { TestBed } from '@angular/core/testing';

import { ErrorRequestService } from './error-request.service';

describe('ErrorRequestService', () => {
  let service: ErrorRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
