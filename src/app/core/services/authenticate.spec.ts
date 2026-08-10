import { TestBed } from '@angular/core/testing';

import { Authenticate } from './authenticate';

describe('Authenticate', () => {
  let service: Authenticate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Authenticate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
