import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SearchService, ICarListing } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  numCols: number = 3;
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
  pageSizeList: number[] = [6, 12, 24, 120]
  pageSize: number = this.pageSizeList[0];
  numRecords: number = 0;
 

  constructor(private route: ActivatedRoute, private searchService: SearchService) {
    const minYear = 1885;
    const maxYear = new Date().getFullYear() + 1;

    this.filterForm = new FormGroup({
      make: new FormControl(''),
      model: new FormControl(''),
      region: new FormControl([]),
      startYear: new FormControl(
        minYear, [Validators.min(minYear), Validators.max(maxYear)]
      ),
      endYear: new FormControl(
        maxYear, [Validators.min(minYear), Validators.max(maxYear)]
      ),
      exteriorCondition: new FormControl([]),
      mechanicalCondition: new FormControl([])
    });
  }

  applySearch(): void {
    this.searchService.getRecords(
      this.page, this.pageSize, this.filterForm.value
    ).subscribe((response) => {
      this.searchResults = response.records;
      this.numRecords = response.numRecords;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params["searchCriteria"]) {
        const parsedParams = JSON.parse(params["searchCriteria"]);
        this.filterForm.patchValue(parsedParams);
      }
      this.applySearch();
    });
  }

  onClickSubmit() {
    this.applySearch();
  }

  onPageChanged(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applySearch();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const windowWidth = (event.target as Window).innerWidth;
    
    if (windowWidth <= 700) {
      this.numCols = 1;
    } else if (windowWidth <= 1000) {
      this.numCols = 2;
    } else {
      this.numCols = 3;
    }
  }
}