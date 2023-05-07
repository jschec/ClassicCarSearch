import { TestBed } from '@angular/core/testing';

import { ListingService } from './Listing.service';

describe('SearchService', () => {
  let service: ListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
