import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { PokemonStatsComponent } from 'src/app/components/pokemon-stats/pokemon-stats.component';
import { MatPaginator } from '@angular/material/paginator';

import Fuse from 'fuse.js';

import { trigger, state, style, transition, animate } from '@angular/animations';


import { environment } from 'src/environments/environment';

import OpenAI from "openai";

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
  animations: [
    trigger('showImage', [
      state('open', style({
        opacity: 1,
        display: 'block',
      })),
      state('closed', style({
        opacity: 0,
        display: 'none',
      })),
      transition('closed => open', [
        animate('1s')
      ]),
    ]),
    // trigger('fadeInOut', [
    //   transition(':enter', [
    //     style({ width: 0, opacity: 0 }),
    //     animate('2s', style({ width: '100%', opacity: 1 })),
    //   ]),
    // ]),
  ]
})

export class PokedexComponent implements OnInit {
  @ViewChild('paginator') paginator:any = MatPaginator;

  typeList: any = [];
  imgStatus: any = [];
  allPokemon: any = [];
  pokemonList: any = [];
  pokemonType: any = [];
  pokemonStats: any = [];
  pokemonImages: any = [];
  storedPokemon: any = [];
  storedPokemonByType: any = [];
  filteredPokemonList: any = [];
  
  currentPage: any = 0;
  totalPage: any = '0';
  limit: any = 20;

  next: any = '';
  previous: any = '';
  selectedType: any = 'all';
  keyWord: any = '';

  firstLoad: boolean = true;
  loading: boolean = false;

  constructor( 
    private router: Router,
    private api: ApiService,
    public dialog: MatDialog
   ) { }

  ngOnInit(): void {
    this.loadAllPokemons();
    this.loadPokemonTypeList();
    // this.AItest();
  }

  // async AItest() {
  //   let openai = new OpenAI({ apiKey: environment.openAI_APIKEY, dangerouslyAllowBrowser: true });
  //   const chatCompletion = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: [{"role": "user", "content": "Write a one-sentence bedtime story about a unicorn."}],
  //   });
  //   console.log(chatCompletion.choices[0].message);
  // }

  loadAllPokemons() {
    this.loading = true;
    this.api.call('https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0', '', 'GET').then((response)=>{
      let res = response ? JSON.parse(response) : [];
      let page = 0;
      for (let i = 0; i < res['results'].length; i += this.limit) {
          const chunk = res['results'].slice(i, i + this.limit);
          this.allPokemon[page] = chunk;
          page++;
      }
      this.storedPokemon = JSON.parse(JSON.stringify(this.allPokemon));
      this.totalPage = res['count'];
    }).catch((error)=>{
      console.log(error)
    }).finally(()=>{
      this.loading = false;
      this.firstLoad = false;
      this.pokemonList = this.allPokemon[this.currentPage].map((data:any)=>{
        this.loadPokemonDetails( data );
        return data;
      });
    })
  }

  loadAllPokemonsByType( type:any ) {
    this.loading = true;
    this.keyWord = ''; // clear value
    this.allPokemon = []; // reset the value
    this.api.call(`https://pokeapi.co/api/v2/type/${type}?limit=1500&offset=0`, '', 'GET').then((response)=>{
      let res = response ? JSON.parse(response) : [];
      let page = 0;
      for (let i = 0; i < res['pokemon'].length; i += this.limit) {
          const chunk = res['pokemon'].slice(i, i + this.limit);
          this.allPokemon[page] = chunk.map((data:any)=>{
            return data['pokemon'];
          });
          page++;
      }
      this.storedPokemonByType = JSON.parse(JSON.stringify(this.allPokemon));
      this.totalPage = res['pokemon'].length;
    }).catch((error)=>{
      console.log(error)
    }).finally(()=>{
      this.loading = false;
      this.pokemonList = this.allPokemon[this.currentPage].map((data:any)=>{
        this.loadPokemonDetails( data );
        return data;
      });
    })
  }

  loadPokemonDetails( data:any ) {
    if( this.pokemonImages[data['name']] ) return;
    this.api.call( data['url'], "", "GET" ).then((response:any)=>{
      let res = response ? JSON.parse(response) : [];
      this.pokemonType[data['name']] = res['types'];
      this.pokemonStats[data['name']] = res['stats'];
      this.pokemonImages[data['name']] = res['sprites']['front_default'];
    })
  }

  loadPokemonTypeList() {
    this.typeList.push('all');
    this.api.call(`https://pokeapi.co/api/v2/type?limit=50&offset=0`, '', 'GET').then((response)=>{
      let res = response ? JSON.parse(response) : [];
      res['results'].map((data:any)=>{
        this.typeList.push(data['name']);
      })
    }).catch((error)=>{
      console.log(error)
    })
  }

  searchPokemon() {
    const options = {
      useExtendedSearch: true,
      threshold: 0.05,
      location: 0,
      distance: 1000,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "name",
      ]
    };
    const lists = this.selectedType == 'all' ? this.storedPokemon.flat(1) : this.storedPokemonByType.flat(1);
    const fuse = new Fuse(lists, options)
    let newList = [];
    newList = this.keyWord ? fuse.search(this.keyWord).map((data: any) => {
      this.loadPokemonDetails( data['item'] );
      return (data['item'] ? data['item'] : '');
    }) : lists

    this.allPokemon = []; // reset value
    let page = 0;
    for (let i = 0; i < newList.length; i += this.limit) {
        const chunk = newList.slice(i, i + this.limit);
        this.allPokemon[page] = chunk.map((data:any)=>{
          return data;
        });
        page++;
    }
    this.paginator.firstPage();
    this.currentPage = 0; // reset page
    this.totalPage = newList.length;
    this.pokemonList = this.allPokemon[this.currentPage];
  }

  triggerPaginate(e:any) {
    if( e.pageIndex > e.previousPageIndex ) {
      this.currentPage += 1;
    } else {
      this.currentPage -= 1;
    }
    this.pokemonList = this.allPokemon[this.currentPage].map((data:any)=>{
      this.loadPokemonDetails( data );
      return data;
    });
  }

  filterByType(e:any){
    this.selectedType = e.value;
    this.paginator.firstPage();
    this.currentPage = 0; // reset page
    if( e.value == 'all' ) {
      this.allPokemon = this.storedPokemon;
      this.totalPage = this.storedPokemon.flat(1).length - 1;
      this.pokemonList = this.allPokemon[this.currentPage].map((data:any)=>{
        this.loadPokemonDetails( data );
        return data;
      });
    } else {
      this.loadAllPokemonsByType( e.value );
    }
  }

  checkStats( name:any ) {
    this.dialog.open(PokemonStatsComponent, {
      data: {
        name: name,
        image: this.pokemonImages[name],
        stats: this.pokemonStats[name],
        type: this.pokemonType[name]
      },
    });
  }

  imgLoaded( name:any ) {
    this.imgStatus[ name ] = true;
  }

  closePokedex() {
    this.router.navigate(['']);
  }

}