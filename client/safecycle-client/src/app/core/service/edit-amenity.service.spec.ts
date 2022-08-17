import { TestBed } from '@angular/core/testing';

import { EditAmenityService } from './edit-amenity.service';

describe('EditAmenityService', () => {
  let service: EditAmenityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditAmenityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
