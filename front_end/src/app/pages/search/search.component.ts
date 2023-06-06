import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IWatchListMinified, WatchListService } from 'src/app/services/watchList.service';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService, ICarListing } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  numCols: number = 3;
  regionOptions = [    
    "NorthEast",
    "SouthWest",
    "West",
    "SouthEast",
    "MidWest"
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

  constructor(
    private route: ActivatedRoute, 
    private searchService: SearchService,
    private watchListService: WatchListService,
    private authService: AuthService,
    private snackBar: MatSnackBar) {
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

  onPinSearch() {
    this.authService.getCurrentUser().subscribe((userInfo) => {

      if (!userInfo.isAuthenticated) {
        this.snackBar.open("Please sign in to save searches!", "close");
        return;
      }

      this.watchListService.getByUserId(userInfo.user!.id).subscribe((watchList) => {
        this.searchService.save(this.filterForm.value).subscribe((response) => {
          let updatedWatchList: IWatchListMinified = {
            searches: watchList.searches.map(listing => listing.id)
          };
  
          updatedWatchList.searches.push(response.id);
  
          this.watchListService.updateWatchList(watchList.id, updatedWatchList).subscribe(() => {
            this.snackBar.open("Search saved!", "close");
          })
        });
      });
    });
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

  formatPriceText(num: number): string {
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
  }

  // FIXME: dateString type is wrong, not match the actual type.
  // formatDateText(dateString: Date): string {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }
}