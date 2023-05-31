import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { IUser } from './services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  cachedUser: IUser | undefined = undefined;

  constructor(
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    this.matIconRegistry.addSvgIcon(
      'google-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "/assets/providers/google-logo.svg"
      )
    );

    this.authService.getCurrentUser().subscribe((response) => {
      if (response.isAuthenticated) {
        this.cachedUser = response.user;
      } else {
        this.cachedUser = undefined;
      }
    });
  }

  /**
   * Logouts the current user.
   */
  public logout() {
    this.authService.logout().subscribe(() => {
      this.cachedUser = undefined;

      // Redirect to the landing page.
      this.router.navigate(['/auth/login']);
    });
  }
}