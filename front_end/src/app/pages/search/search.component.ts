import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SearchService, ICarListing } from 'src/app/core/services/search.service';
import { ICar } from 'src/app/core/services/cars.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
//TODO: Alternative to blanks for show all
export class SearchComponent {
  regionOptions = [
  "",
    "Northeast",
    "Southwest",
    "West",
    "Southeast",
    "Midwest"
  ]

  qualityOptions = [
  "",
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

constructor(private route: ActivatedRoute, private router: Router, private searchService: SearchService) {
const minYear = 1885;
const maxYear = new Date().getFullYear() + 1;

this.filterForm = new FormGroup({
make: new FormControl(''),
model: new FormControl(''),
region: new FormControl(''),
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

goToDetail(carRecord: ICar){
    this.router.navigate(['/car', carRecord._id])
}
//TODO: Is this necessary, when we could do an empty search?
seeAll(event: PageEvent){
  this.searchService.getAllRecords(this.page, this.pageSize);
}
}