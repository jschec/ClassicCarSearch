import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchListRoutingModule } from './watch-list-routing.module';
import { WatchListComponent } from './watch-list/watch-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecommendationComponent } from './recommendation/recommendation.component';

@NgModule({
  declarations: [
    WatchListComponent,
    RecommendationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WatchListRoutingModule,
  ]
})
export class WatchListModule { }
