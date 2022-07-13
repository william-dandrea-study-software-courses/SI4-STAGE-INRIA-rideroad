import { TestBed } from '@angular/core/testing';

import { MapClickService } from './map-click.service';

describe('MapClickService', () => {
  let service: MapClickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapClickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
