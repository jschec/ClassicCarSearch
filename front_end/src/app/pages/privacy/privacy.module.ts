import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyRoutingModule } from './privacy-routing.module';
import { PrivacyComponent } from './privacy/privacy.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PrivacyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PrivacyRoutingModule
  ]
})
export class PrivacyModule { }
