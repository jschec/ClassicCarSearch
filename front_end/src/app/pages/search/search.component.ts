import { Component, Injectable} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of, Observable, concat } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
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
  pageSizeList: number[] = [5, 10, 25, 100]
  pageSize: number = this.pageSizeList[0];
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
      exteriorCondition: new FormControl(''),
      mechanicalCondition: new FormControl('')
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
    console.log(JSON.stringify(this.filterForm.value));
    
    this.router.navigate(['/search'], navigationExtras);
  }

  onPageChanged(event: PageEvent): void {
    this.updateSearchByPage(event.pageSize, event.pageIndex);
    //this.saveState();
    //this.needScrollToBottom = true;
  }
  
  //TODO - Why are ids not accessable? Will this work?
  gotoDetail(targetDetail: ICarListing){
    console.log(targetDetail.car);
    this.router.navigate(['/car-detail', { id: targetDetail.car}])
  }
  
  
  //TODO - Do I need this top part? If so, what's my equivalent for the if statements?
  private updateSearchByPage(pageSize: number, page: number): void {
    
    if (!this.searchResults) {
      this.searchResults = [];
      this.page = 0;
      this.pageSize = pageSize;
      return;
    }
    
    this.page = page;
    this.pageSize = pageSize;
    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    this.searchResults = (this.searchResults as ICarListing[]).slice(start, end);
  }
}
