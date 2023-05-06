import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule),
  },
  {
    path: 'privacy',
    loadChildren: () => import('./pages/privacy/privacy.module').then(m => m.PrivacyModule),
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule),
  },
  {
    path: 'example',
    loadChildren: () => import('./pages/example/example.module').then(m => m.ExampleModule),
  },
  {
    path: 'subscription',
    loadChildren: () => import('./pages/subscription/subscription.module').then(m => m.SubscriptionModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'watch-list',
    loadChildren: () => import('./pages/watch-list/watch-list.module').then(m => m.WatchListModule),
    canActivate: [AuthGuard]
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
