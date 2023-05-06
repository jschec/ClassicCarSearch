import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type Condition = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface ICar {
  make: string;
  model: string;
  year: number;
  exteriorCondition: Condition;
  mechanicalCondition: Condition;
  mileage: number;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  constructor(private http: HttpClient) { }

  public getRecords(): Observable<ICar[]> {
    const url = '/api/cars';
    return this.http.get<ICar[]>(url);
  }
}
