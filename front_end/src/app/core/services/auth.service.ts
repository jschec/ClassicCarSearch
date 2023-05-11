import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject('LOCALSTORAGE') private localStorage: Storage
  ) {}
  
  getCurrentUser(): any {
    // TODO: Enable after implementation
    return JSON.parse(this.localStorage.getItem('currentUser') as any);
}

  logout(): void {
    // clear token remove user from local storage to log user out
    this.localStorage.removeItem('currentUser');
  }
}