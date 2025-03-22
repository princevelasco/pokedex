import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { SideBarComponent } from './components/side-bar/side-bar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { RouterModule } from '@angular/router';

const MODULES = [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, OverlayModule, RouterModule]

@NgModule({
  declarations: [ SideBarComponent, NavBarComponent, LoaderComponent ],
  imports: [...MODULES],
  exports: [...MODULES, SideBarComponent, LoaderComponent]
})
export class SharedModule { }
