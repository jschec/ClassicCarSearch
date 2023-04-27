import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { WatchListComponent } from './watch-list/watch-list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: WatchListComponent },
      { path: 'recommendation/:id', component: RecommendationComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WatchListRoutingModule { }