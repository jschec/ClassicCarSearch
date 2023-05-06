import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './pages/about/about.component';
import { CarDetailComponent } from './pages/car-detail/car-detail.component';
import { ExampleComponent } from './pages/example/example.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { MarketDataComponent } from './pages/market-data/market-data.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';
import { SearchComponent } from './pages/search/search.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { WatchListComponent } from './pages/watch-list/watch-list.component';

//import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: LandingComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'search/:id',
    component: MarketDataComponent,
  },
  {
    path: 'car/:id',
    component: CarDetailComponent,
  },
  {
    path: 'example',
    component: ExampleComponent,
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'watch-list',
    component: WatchListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'watch-list/:id',
    component: RecommendationComponent,
    //canActivate: [AuthGuard]
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
