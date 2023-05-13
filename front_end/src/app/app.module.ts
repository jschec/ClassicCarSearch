import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

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

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CarDetailComponent,
    ExampleComponent,
    LandingComponent,
    LoginComponent,
    MarketDataComponent,
    PrivacyComponent,
    RecommendationComponent,
    SearchComponent,
    SubscriptionComponent,
    WatchListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, 
    ReactiveFormsModule,
    CoreModule,
    AppRoutingModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
