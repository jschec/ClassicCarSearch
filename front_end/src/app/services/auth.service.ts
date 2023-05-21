import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface IProvider {
  name: string;
  svgIconName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  public isAuthenticated() : Boolean {
    let userData = localStorage.getItem('userInfo')
    if(userData && JSON.parse(userData)){
      return true;
    }
    
    return false;
  }

  public setUserInfo(user: IUser): void {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public login(provider: string): Observable<IUser> {
    return this.http.get<IUser>(`/api/auth/${provider.toLowerCase()}`);
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