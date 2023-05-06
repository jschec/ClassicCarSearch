import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { 
  GoogleLoginProvider, 
  SocialAuthService, 
  SocialUser 
} from '@abacritt/angularx-social-login';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  GoogleLoginProvider = GoogleLoginProvider;
  loading: boolean = false;

  constructor(
    private router: Router,
    private readonly socialAuthService: SocialAuthService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.socialAuthService.authState.subscribe(
      user => {
        this.authService.login(user);
        this.router.navigate(['/']);
      },
      error => {
        // TODO - somehow notify the user
        this.loading = false;
      }
    );
  }
}
