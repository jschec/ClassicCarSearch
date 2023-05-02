import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject('LOCALSTORAGE') private localStorage: Storage
  ) {}

  login(user: SocialUser) {
    this.localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): any {
    // TODO: Enable after implementation
    return JSON.parse(this.localStorage.getItem('currentUser') as any);
}

  logout(): void {
    // clear token remove user from local storage to log user out
    this.localStorage.removeItem('currentUser');
  }
}