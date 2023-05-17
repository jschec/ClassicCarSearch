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

  constructor(private http: HttpClient) { }

  getUser(userId: string): Observable<IUser> {
    const url = `/api/user/${userId}`;
    return this.http.get<IUser>(url);
  }
}
