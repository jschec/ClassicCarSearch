import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CarDetailComponent } from './pages/car-detail/car-detail.component';
import { LandingComponent } from './pages/landing/landing.component';
import { SearchComponent } from './pages/search/search.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { WatchListComponent } from './pages/watch-list/watch-list.component';

const routes: Routes = [
  {
    path: 'home',
    component: LandingComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'car/:id',
    component: CarDetailComponent,
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
  },
  {
    path: 'watch-list',
    component: WatchListComponent,
  },

  {
    path: 'car-detail/:id',
    component: CarDetailComponent,
    
  },
  {
    path: 'car-detail',
    component: CarDetailComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
