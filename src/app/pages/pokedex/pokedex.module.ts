import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokedexRoutingModule } from './pokedex-routing.module';
import { PokedexComponent } from './pokedex.component';
import { MaterialModule } from 'src/app/material.module';
import { PokemonStatsComponent } from 'src/app/components/pokemon-stats/pokemon-stats.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PokedexComponent, PokemonStatsComponent
  ],
  imports: [
    CommonModule,
    PokedexRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class PokedexModule { }
