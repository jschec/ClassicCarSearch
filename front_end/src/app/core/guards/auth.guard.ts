import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const user = this.authService.getCurrentUser();

    if (user) {
      if (moment() < moment(user.expiration)) {
        return true;
      } else {
        //this.notificationService.openSnackBar('Your session has expired');
        this.router.navigate(['auth/login']);
        return false;
      }

    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
  
}
