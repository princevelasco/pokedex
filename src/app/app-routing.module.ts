import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guard/auth.guard';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { BerryComponent } from './pages/berry/berry.component';
import { PokemonComponent } from './pages/pokemon/pokemon.component';

const routes: Routes = [
  { path: '', component: HomeComponent, loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'login', component: LoginComponent, loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'pokemon', component: PokemonComponent, loadChildren: () => import('./pages/pokemon/pokemon.module').then(m => m.PokemonModule), canActivate: [AuthGuard] },
  { path: 'berry', component: BerryComponent, loadChildren: () => import('./pages/berry/berry.module').then(m => m.BerryModule), canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }