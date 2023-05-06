import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleComponent } from './example/example.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ExampleRoutingModule } from './example-routing.module';


@NgModule({
  declarations: [
    ExampleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExampleRoutingModule
  ]
})
export class ExampleModule { }
