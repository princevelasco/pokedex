import { ApiService } from 'src/app/core/services/api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface pokemonData {
  stats: any;
  name: any;
  image: any;
  type: any;
  id: any;
}

@Component({
  selector: 'app-poke-stats',
  templateUrl: './poke-stats.component.html',
  styleUrls: ['./poke-stats.component.scss'],
  animations: [
    // flip pokemon image animation
    trigger('flipState', [
      state('front', style({
        transform: 'rotateY(179deg)'
      })),
      state('back', style({
        transform: 'rotateY(0)'
      })),
      transition('front => back', animate('500ms ease-out')),
      transition('back => front', animate('500ms ease-in'))
    ])
  ]
})
export class PokeStatsComponent implements OnInit {
  flip: string = 'back';
  description : any = 'Loading...';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: pokemonData,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.loadPokemonDescription();
  }

  // fetch pokemon description
  loadPokemonDescription() {
    this.api.call( `https://pokeapi.co/api/v2/pokemon-species/${this.data['id']}`, "", "GET" ).then((response)=>{
      let res = response ? JSON.parse(response) : [];
      this.description = res['flavor_text_entries'][0] ? res['flavor_text_entries'][0]['flavor_text'] : 'No result';
    }).catch((error)=>{
      console.log(error);
      this.description = "Something went wrong, Please try again later."
    })
  }

  // toggle the pokemon image flip
  toggleFlip() {
    this.flip = (this.flip == 'back') ? 'front' : 'back';
  }

}