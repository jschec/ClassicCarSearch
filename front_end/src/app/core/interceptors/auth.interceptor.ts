import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const user = this.authService.getCurrentUser();

    if (user && user.token) {

      const cloned = request.clone({
          headers: request.headers.set('Authorization',
              'Bearer ' + user.token)
      });

      return next.handle(cloned).pipe(tap(() => { }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              //this.dialog.closeAll();
              this.router.navigate(['/auth/login']);
            }
          }
      }));

    } else {
      return next.handle(request);
    }
  }
}
