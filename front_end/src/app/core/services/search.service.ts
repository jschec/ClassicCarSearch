import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarDetailComponent } from 'src/app/pages/car-detail/car-detail.component';


export interface ICarListing{
  carId: string;
  make: string;
  model: string;
  year: number;
  condition: string;
  region: string;
  mileage: number;
  price: number;
  listDate: number;
  saleDate: number;
  isActive: boolean;
  listingDescription: string;
}
export interface IFakeCar{
  
}

export interface ISearch{
  id: string;
  searchResults: ICarListing[];
}
const Regions: string[] = ["Northeast", "Southeast", "Midwest", "West", "Southwest" ]
const Conditions: string[] = ["Bad", "Fair", "Good", "Excellent"]

const mockData: ISearch = {
  id: "something",
  searchResults: [
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
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) { }

 public getRecords(): ISearch {
    const url = '/api/search';
    return mockData;
}
}




