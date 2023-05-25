import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ICar {
  make: string;
  model: string;
  year: number;
  exteriorCondition: Condition;
  mechanicalCondition: Condition;
  mileage: number;
  color: string;
  img: string;
}

export interface ICarSeller {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ICarListing {
  region: string;
  price: number;
  listDate: Date;
  saleDate: Date | null;
  seller: ICarSeller; 
  car: ICar;
}

//TODO: What should search be?
export interface ISearchForecast {
  search: string;
  avgTimeOnMarket: number;
  avgPrice: number;
  averageMileage: number;
  ttl: number;
  priceHistory: number[];
}

export enum Condition {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  Bad = 'Bad',
}



@Injectable({
  providedIn: 'root'
})
export class CarDetailsService {

  constructor(private http: HttpClient) { }

  public getBylistingId(carlistingId: string): Observable<ICarListing> {
    const url = '/api/car-listings/' + carlistingId ;
    return this.http.get<ICarListing>(url); 
  }
}
