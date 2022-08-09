import { TestBed } from '@angular/core/testing';

import { GpsDistanceService } from './gps-distance.service';

describe('GpsDistanceService', () => {
  let service: GpsDistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpsDistanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
