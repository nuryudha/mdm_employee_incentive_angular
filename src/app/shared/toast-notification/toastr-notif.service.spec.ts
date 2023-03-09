import { TestBed } from '@angular/core/testing';

import { ToastrNotifService } from './toastr-notif.service';

describe('ToastrNotifService', () => {
  let service: ToastrNotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrNotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
