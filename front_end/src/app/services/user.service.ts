import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUri: string;
  age: number;
  subscription: string;
  watchList: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId: string = 'ee31988f-bb01-4c31-b4a2-5e15073ad08d';

  constructor(private http: HttpClient) { }

  public getCurrentUser(): Observable<IUser> {
    const url = `/api/users/${this.userId}`;
    return this.http.get<IUser>(url);
  }

  public setSubscription(subscriptionId: string): Observable<IUser> {
    const url = `/api/users/${this.userId}`;
    const body = { subscription: subscriptionId };
    return this.http.put<IUser>(url, body);
  }
}
