import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ISubscription {
  id: string;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  public getRecords(): Observable<ISubscription[]> {
    const url = '/api/subscriptions';
    return this.http.get<ISubscription[]>(url);
  }
}
