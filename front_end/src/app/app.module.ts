import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

// Components
import { CarDetailComponent } from './pages/car-detail/car-detail.component';
import { LandingComponent } from './pages/landing/landing.component';
import { SearchComponent } from './pages/search/search.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { WatchListComponent } from './pages/watch-list/watch-list.component';

// Services
import { CarsService } from './services/cars.service';
import { SearchService } from './services/search.service';
import { SubscriptionService } from './services/subscription.service';
import { CarDetailsService } from './services/car-details.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    CarDetailComponent,
    LandingComponent,
    SearchComponent,
    SubscriptionComponent,
    WatchListComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule, 
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
  ],
  providers: [
    CarsService,
    CarDetailsService,
    SubscriptionService,
    SearchService,
    UserService,
    MediaMatcher,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
