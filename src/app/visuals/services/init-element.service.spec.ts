import { TestBed } from '@angular/core/testing';

import { InitElementService } from './init-element.service';

describe('InitElementService', () => {
  let service: InitElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
