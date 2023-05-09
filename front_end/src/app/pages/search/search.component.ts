import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListingService, IListing } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent {
  listings: IListing[] = [];
  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
    this.listingService.getRecords().subscribe((response) => {
      this.listings = response;

      console.log(this.listings);
    });
  }
}
