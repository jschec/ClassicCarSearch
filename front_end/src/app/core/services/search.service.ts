import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ISearch {
    id: string;
}

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    constructor(private http: HttpClient) { }

    public getByIds(ids: string[]): Observable<ISearch[]> {
        const url = '/api/search';
        const body = "";
        return this.http.post<ISearch[]>(url, body);
    }

}