import { Component } from '@angular/core';

import { AuthService, IProvider } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  providerOptions: IProvider[];

  constructor(private authService: AuthService) {
    this.providerOptions = this.authService.getProviders();
  }
}
