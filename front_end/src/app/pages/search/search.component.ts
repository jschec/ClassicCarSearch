import { Component, Injectable} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of, Observable, concat } from 'rxjs';
import { SearchService, ISearch, ICarListing } from 'src/app/core/services/search.service';
import { NavigationExtras, Router } from '@angular/router';


const defaultData: ICarListing[] = [
  {
    carId: "1",
    make: "Furtzwagen",
    model: "Gorb",
    year: 1999,
  condition: "Fair",
  region: "West",
  mileage: 1066,
  price: 150,
  listDate: 2020,
  saleDate: 2021,
  isActive: false,
  listingDescription: "Wow wow wow"
  },
  {
    carId: "2",
    make: "Furtzwagen",
    model: "Fart Car",
    year: 2999,
  condition: "Excellent",
  region: "Southwest",
  mileage: 2066,
  price: 160,
  listDate: 2020,
  saleDate: 2025,
  isActive: true,
  listingDescription: "Ha ha ha"
  }
]
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
  searchResults: ISearch = {id: "0", searchResults: defaultData};

  constructor(private listingService: SearchService, private router : Router) {
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
    this.searchResults = this.listingService.getRecords();
    filterForm: FormGroup;
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
