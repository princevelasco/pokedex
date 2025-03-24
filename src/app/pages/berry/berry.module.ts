import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BerryRoutingModule } from './berry-routing.module';

import { BerryComponent } from './berry.component';
import { BerryDetailComponent } from './components/berry-detail/berry-detail.component';

@NgModule({
  declarations: [
    BerryComponent, BerryDetailComponent
  ],
  imports: [
    BerryRoutingModule,
    SharedModule
  ]
})
export class BerryModule { }
