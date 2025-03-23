import { NgModule } from '@angular/core';

import { BerryRoutingModule } from './berry-routing.module';
import { BerryComponent } from './berry.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    BerryComponent
  ],
  imports: [
    BerryRoutingModule,
    SharedModule
  ]
})
export class BerryModule { }
