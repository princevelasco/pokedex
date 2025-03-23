import { NgModule } from '@angular/core';
import { PokemonRoutingModule } from './pokemon-routing.module';
import { PokemonComponent } from './pokemon.component';
import { SharedModule } from 'src/app/shared/shared.module';
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