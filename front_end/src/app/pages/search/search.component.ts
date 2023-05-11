import { Component, Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of, Observable, concat } from 'rxjs';
import { SearchService, ISearch, ICarListing } from 'src/app/core/services/search.service';



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
  
  //searchResults: ISearch = {id: "0", searchResults: defaultData};
  searchResults: ISearch = {id: "0", searchResults: defaultData};
  constructor(private listingService: SearchService) {}

  ngOnInit(): void {
    this.searchResults = this.listingService.getRecords();


}
}


/** Region Select with multiple selection */
/* @Component({
  selector: 'select-multiple-region',
  templateUrl: 'select-multiple-region.html',
})
export class SelectMultipleRegion {
  regionSelect = new FormControl('');
  regionsList: string[] = ["Northeast", "Southeast", "Midwest", "West", "Southwest" ]; 
}*/
