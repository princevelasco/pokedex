import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface pokemonData {
  stats: any;
  name: any;
  image: any;
  type: any;
}

@Component({
  selector: 'app-pokemon-stats',
  templateUrl: './pokemon-stats.component.html',
  styleUrls: ['./pokemon-stats.component.scss']
})
export class PokemonStatsComponent implements OnInit {
  total:any=0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: pokemonData,
  ) { }

  ngOnInit(): void {
    this.data.stats.map((detail:any)=>{
      this.total += Number(detail['base_stat']);
    })
  }

}
