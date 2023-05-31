import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from './user.service';

export interface IProvider {
  name: string;
  svgIconName: string;
}

export interface IAuthResponse {
  user?: IUser;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public getCurrentUser(): Observable<IAuthResponse> {
    const url = '/api/auth/session';
    return this.http.get<IAuthResponse>(url);
  }

  public logout(): Observable<void> {
    const url = '/api/auth/session';
    return this.http.delete<void>(url);
  }

  public getProviders(): IProvider[] {
    return [
      {
        name: 'Google',
        svgIconName: 'google-logo'
      }
    ];
  }
}