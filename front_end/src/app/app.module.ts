import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material module
import {A11yModule} from '@angular/cdk/a11y';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CdkListboxModule} from '@angular/cdk/listbox';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import {CdkMenuModule} from '@angular/cdk/menu';
import {DialogModule} from '@angular/cdk/dialog';

// Interceptors
import { httpInterceptorProviders } from './interceptors/http.interceptor';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { CarDetailComponent } from './pages/car-detail/car-detail.component';
import { LandingComponent } from './pages/landing/landing.component';
import { SearchComponent } from './pages/search/search.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { WatchListComponent } from './pages/watch-list/watch-list.component';

// Services
import { AuthService } from './services/auth.service';
import { CarsService } from './services/cars.service';
import { CarDetailsService } from './services/car-details.service';
import { LoginComponent } from './pages/login/login.component';
import { SearchService } from './services/search.service';
import { SubscriptionService } from './services/subscription.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    CarDetailComponent,
    LandingComponent,
    SearchComponent,
    SubscriptionComponent,
    WatchListComponent,
    LoginComponent,
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
    A11yModule,
    CdkAccordionModule,
    ClipboardModule,
    CdkListboxModule,
    CdkMenuModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    DialogModule,
  ],
  providers: [
    AuthService,
    CarsService,
    CarDetailsService,
    SubscriptionService,
    SearchService,
    UserService,
    MediaMatcher,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
