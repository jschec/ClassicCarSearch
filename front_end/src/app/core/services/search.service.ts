import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ISearch {

}

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    constructor(private http: HttpClient) { }

    public searchByCriteria(criteria: string): Observable<ISearch> {
        // TODO:
        const url = '/api/search/' + criteria;
        return this.http.get<ISearch>(url);
    }

}