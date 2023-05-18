import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';

import { CarsService } from './services/cars.service';
import { SearchService } from './services/search.service';
import { SubscriptionService } from './services/subscription.service';
import { CarDetailsService } from './services/car-details.service';
import { UserService } from './services/user.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    CarsService,
    CarDetailsService,
    SubscriptionService,
    SearchService,
    UserService,
    MediaMatcher,
  ]
})
export class CoreModule { }
