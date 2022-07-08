import { TestBed } from '@angular/core/testing';

import { AutoCompletionAddressService } from './auto-completion-address.service';

describe('AutoCompletionAddressService', () => {
  let service: AutoCompletionAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoCompletionAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
