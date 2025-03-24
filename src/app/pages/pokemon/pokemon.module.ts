import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PokemonRoutingModule } from './pokemon-routing.module';

import { PokemonComponent } from './pokemon.component';
import { PokeStatsComponent } from './components/poke-stats/poke-stats.component';

@NgModule({
  declarations: [
    PokemonComponent, PokeStatsComponent
  ],
  imports: [
    PokemonRoutingModule,
    SharedModule
  ]
})
export class PokemonModule { }