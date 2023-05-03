import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SubscriptionRoutingModule,
    MatCardModule,
    MatGridListModule
  ]
})
export class SubscriptionModule { }
