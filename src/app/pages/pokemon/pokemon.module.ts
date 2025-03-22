import { NgModule } from '@angular/core';
import { PokemonRoutingModule } from './pokemon-routing.module';
import { PokemonComponent } from './pokemon.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatsComponent } from './components/stats/stats.component';

@NgModule({
  declarations: [
    PokemonComponent, StatsComponent
  ],
  imports: [
    PokemonRoutingModule,
    SharedModule
  ]
})
export class PokemonModule { }