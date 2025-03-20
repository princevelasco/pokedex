import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { PokedexComponent } from './pages/pokedex/pokedex.component';

const routes: Routes = [
  { path: '', component: HomeComponent, loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'pokedex', component: PokedexComponent, loadChildren: () => import('./pages/pokedex/pokedex.module').then(m => m.PokedexModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
