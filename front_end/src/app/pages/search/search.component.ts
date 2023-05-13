import { Component, Injectable} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of, Observable, concat } from 'rxjs';
import { SearchService, ISearch, ICarListing } from 'src/app/core/services/search.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {
  regionOptions = [
    "Northeast",
    "Southwest",
    "West",
    "Southeast",
    "Midwest"
  ]
  qualityOptions = [
    "Bad",
    "Fair",
    "Good",
    "Excellent"
  ]

  filterForm: FormGroup;  
  searchResults: ICarListing[] = [];
  page: number = 0;
  pageSize: number = 10;
  numRecords: number = 0;

  constructor(private searchService: SearchService, private router : Router) {
    const minYear = 1885;
    const maxYear = new Date().getFullYear() + 1;

    this.filterForm = new FormGroup({
      make: new FormControl(''),
      model: new FormControl(''),
      selectedRegion: new FormControl(''),
      startYear: new FormControl(
        minYear, [Validators.min(minYear), Validators.max(maxYear)]
      ),
      endYear: new FormControl(
        maxYear, [Validators.min(minYear), Validators.max(maxYear)]
      ),
      minQuality: new FormControl('')
      });
    
  }

  ngOnInit(): void {
    this.searchService.getRecords(this.page, this.pageSize, {}).subscribe((response) => {
      this.searchResults = response.records; 
      this.numRecords = response.numRecords;
      console.log(this.searchResults);
    });
  }

  onClickSubmit() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        searchCriteria: JSON.stringify(this.filterForm.value)
      }
    }

    this.router.navigate(['/search'], navigationExtras);
  }
}
