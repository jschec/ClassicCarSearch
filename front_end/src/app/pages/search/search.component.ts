import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchService, ISearch } from 'src/app/core/services/search.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class ListingComponent {
  searchResults: ISearch[] = [];
  constructor(private listingService: SearchService) {}

  ngOnInit(): void {
    this.listingService.getRecords().subscribe((response) => {
      this.searchResults = response;

      console.log(this.searchResults);
    });
  }
}
