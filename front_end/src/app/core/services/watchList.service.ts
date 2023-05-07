import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IWatchList {
    user: string;
    searches: string[]
}

@Injectable({
    providedIn: 'root'
})
export class WatchListService {

    constructor(private http: HttpClient) { }

    public getByUserId(userId: string): Observable<IWatchList> {
        const url = '/api/users/' + userId + '/watchlist';
        return this.http.get<IWatchList>(url);
    }

}