import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISearch } from './search.service';

export interface IWatchListPopulated {
  id: string;
  user: string;
  searches: ISearch[];
}

export interface IWatchListMinified {
  id?: string;
  user?: string;
  searches: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WatchListService {

  constructor(private http: HttpClient) { }

  public updateWatchList(watchListId: string, updatedRed: IWatchListMinified): Observable<IWatchListMinified> {
    const url = `/api/watch-lists/${watchListId}`;
    return this.http.put<IWatchListMinified>(url, updatedRed);
  }

  public getByWatchListId(watchListId: string): Observable<IWatchListMinified> {
    const url = `/api/watch-lists/${watchListId}`;
    return this.http.get<IWatchListMinified>(url);
  }

  public getByUserId(userId: string): Observable<IWatchListPopulated> {
    const url = `/api/users/${userId}/watchlist`;
    return this.http.get<IWatchListPopulated>(url);
  }
}