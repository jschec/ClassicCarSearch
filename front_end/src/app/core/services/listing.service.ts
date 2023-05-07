import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export interface ISearch {
  

}

export class SearchService {

  constructor(private http: HttpClient) { }

 public getRecords(): Observable<ISearch[]> {
    const url = '/api/search';
    return this.http.get<ISearch[]>(url);
}
