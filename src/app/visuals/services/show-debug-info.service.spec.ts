import { TestBed } from '@angular/core/testing';

import { ShowDebugInfoService } from './show-debug-info.service';

describe('ShowDebugInfoService', () => {
  let service: ShowDebugInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowDebugInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
