import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export interface IListing {
  id: string;
  region: string;
  price: number;
  listDate: Date;
  saleDate: Date;
  sellerId: string;
  carId: string;
  isActive: boolean;
  listingDescription: string;
  listingTitle: string;
}

export class SearchService {
  constructor(private http: HttpClient) { }

 public getRecords(): Observable<IListing[]> {
    const url = '/api/search';
    return this.http.get<IListing[]>(url);
}
}


