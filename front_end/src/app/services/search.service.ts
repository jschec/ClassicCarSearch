import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICar, ISearchForecast } from './cars.service';

export interface ICriteria {
  search: string;
  region?: string[];
  startYear?: number;
  endYear?: number;
  maxMileage?: number;
  maxPrice?: number;
  exteriorCondition?: string[];
  mechanicalCondition?: string[];
  color?: string;
  make?: string;
  model?: string;
}

export interface ISeller {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ICarListing {
  _id: string;
  car: ICar;
  region: string;
  listDate: Date;
  saleDate: Date | null;
  seller: ISeller;
  price: number;
}

export interface ISearch {
  id: string;
  criteria: ICriteria;
  results: ICarListing[];
}

export interface IPaginationResponse<T> {
  page: number;
  pageSize: number;
  records: T[];
  numRecords: number;
}

export interface ISearchCrtieria {
  region: any;
  maxMileage: number;
  maxPrice: number;
  exteriorCondition: any;
  mechanicalCondition: any;
  color: string;
  make: string;
  model: string;
}
/*TODO
export interface ISearchForecast {
  avgTimeOnMarket: number;
  avgPrice: number;
  averageMileage: number;
  ttl: number;
  priceHistory: number[];
  forecastRegion: string;
}*/

export type SearchCriteriaRequest = Partial<ISearchCrtieria>;

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  constructor(private http: HttpClient) { }

  public getRecords(
    page: number, pageSize: number, criteria: SearchCriteriaRequest
  ): Observable<IPaginationResponse<ICarListing>> {
    
    const url = '/api/searches';
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("pageSize", pageSize);
    
    for (let [k, v] of Object.entries(criteria)) {
      // Skip empty values
      if (v === undefined || v === null || v === "" || v.length == 0) {
        continue;
      }
      //Handle arrays
      if (k === "region" || k === "exteriorCondition" || k === "mechanicalCondition") {        
        v = v.toString();
      }

      queryParams = queryParams.append(k, v);      
    }
    return this.http.get<IPaginationResponse<ICarListing>>(url, { params: queryParams });
  }

  public save(criteria: SearchCriteriaRequest): Observable<ISearch> {
    const url = '/api/searches';

    let queryBody: Record<string, any> = {};

    for (let [k, v] of Object.entries(criteria)) {
      // Skip empty values
      if (v === undefined || v === null || v === "" || v.length == 0) {
        continue;
      }
      //Handle arrays
      if (k === "region" || k === "exteriorCondition" || k === "mechanicalCondition") {        
        v = v.toString();
      }

      queryBody[k] = v;
    }
        
    return this.http.post<ISearch>(url, queryBody);
  }
}