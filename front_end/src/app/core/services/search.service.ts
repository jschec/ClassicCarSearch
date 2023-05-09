import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarDetailComponent } from 'src/app/pages/car-detail/car-detail.component';

@Injectable({
  providedIn: 'root'
})

export interface ISearch{
  id: string;
  searchResults: CarDetailComponent[];

}

export class SearchService {
  constructor(private http: HttpClient) { }

 public getRecords(): Observable<ISearch[]> {
    const url = '/api/search';
    return this.http.get<ISearch[]>(url);
}
}


