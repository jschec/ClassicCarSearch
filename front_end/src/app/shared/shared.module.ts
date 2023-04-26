import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ThemeModule } from '../theme/theme.module';
import { LayoutComponent } from './layout/layout.component';


@NgModule({
  imports: [
    RouterModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LayoutComponent
  ]
})
export class SharedModule { }
