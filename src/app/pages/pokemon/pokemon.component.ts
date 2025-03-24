import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { PokeStatsComponent } from './components/poke-stats/poke-stats.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import Fuse from 'fuse.js';
import OpenAI from "openai";

import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
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
  ]
})
export class PokemonComponent implements OnInit {
  @ViewChild('paginator') paginator:any = MatPaginator;

  typeList: any = [];
  imgStatus: any = [];
  allPokemon: any = [];
  pokemonList: any = [];
  pokemonIDs: any = [];
  pokemonType: any = [];
  pokemonStats: any = [];
  pokemonImages: any = [];
  storedPokemon: any = [];
  storedPokemonByType: any = [];
  storedPokemonByAI: any = [];
  filteredPokemonList: any = [];
  
  currentPage: any = 0;
  totalPage: any = '0';
  limit: any = 20;

  next: any = '';
  previous: any = '';
  selectedType: any = 'all';
  keyWord: any = '';
  advanceKeyWord: any = '';

  firstLoad: boolean = true;
  loading: boolean = false;
  isMobile: boolean = false;
  
  unsubscribe = new Subject<void>();

  constructor( 
    private router: Router,
    private api: ApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver
   ) { 
    this.breakpointObserver.observe('(max-width: 767px)').pipe(takeUntil(this.unsubscribe)).subscribe(result=>{
      this.isMobile = result.breakpoints['(max-width: 767px)'];
    });
   }

  ngOnInit(): void {
    this.loadAllPokemons();
    this.loadPokemonTypeList();
  }

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
      this.pokemonIDs[data['name']] = res['id'];
    })
  }

  loadPokemonTypeList() {
    this.typeList.push('all');
    this.api.call(`https://pokeapi.co/api/v2/type`, '', 'GET').then((response)=>{
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
    // blank type means that the advance search is triggered
    const lists = this.selectedType != '' ? ( this.selectedType == 'all' ? this.storedPokemon.flat(1) : this.storedPokemonByType.flat(1) ) : this.storedPokemonByAI.flat(1);
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

  async advanceSearch() {
    if( this.loading || !this.advanceKeyWord ) return;
    this.loading = true;
    const openai = new OpenAI({
      apiKey: environment.OPENAPI_KEY,
      dangerouslyAllowBrowser: true
    });
    await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{"role": "user", "content": `Provide me a JSON text of pokemon name only with the key name of 'pokemon' that is ${this.advanceKeyWord} no other text`}],
    }).then((response)=>{
      let result = response.choices[0].message.content || '';
      let arrayedResult: any = {}; // store the split result
      let jsonResultRaw: any = ''; // store json string result
      let jsonResultClean: any = {}; // store the clean result
  
      // check if json exist
      if( result.includes('json') && result.includes('```') ) {
        arrayedResult = result.split('```');
        arrayedResult.map((r:any)=>{
          if( r.includes('json') ) {
            jsonResultRaw = r;
          }
        });
  
        // remove extra strings
        jsonResultClean = jsonResultRaw.split("\n").join('').replace('json','');
        jsonResultClean = JSON.parse(jsonResultClean);
  
        // check if pokemon exist
        if( jsonResultClean['pokemon'] ) {
          this.selectedType = ''; // clear type dropdown, this can be used to view again all the pokemons
          this.paginator.firstPage(); // reset paginator
          this.currentPage = 0; // reset current page
          let list: any = []; // used to store pokemon from json result
          let newPokemonList: any = []; // this will be the final result
          let pokemonOriginalList = this.storedPokemon.flat(1); // get all pokemons
  
          // check if result has more than one result
          if( Array.isArray(jsonResultClean['pokemon']) ) {
            // making sure that the pokemon names are in lowercase to match it in "All pokemon list"
            jsonResultClean['pokemon'].map((pokemon:any)=>{
              if( pokemon ) list.push(pokemon.toLowerCase())
            })
          } else {
            list.push(jsonResultClean['pokemon'].toLowerCase())
          }
          jsonResultClean = list;
  
          // search if the pokemon exist in our "All pokemon list"
          pokemonOriginalList.map((pokemon:any)=>{
            if( jsonResultClean.includes(pokemon['name']) ) {
              newPokemonList.push(pokemon);
            }
          })
  
          // display the new pokemon list
          this.allPokemon = []; // reset the value
          let page = 0;
          for (let i = 0; i < newPokemonList.length; i += this.limit) {
              const chunk = newPokemonList.slice(i, i + this.limit);
              this.allPokemon[page] = chunk;
              page++;
          }
          this.storedPokemonByAI = JSON.parse(JSON.stringify(this.allPokemon));
          this.totalPage = newPokemonList.length; // set total page
          this.pokemonList = this.allPokemon[this.currentPage].map((data:any)=>{
            this.loadPokemonDetails( data );
            return data;
          });
        } else {
          this.openSnackBar('No result found!');
        }
      } else {
        this.openSnackBar('No result found!');
      }
    }).catch((error)=>{
      this.openSnackBar('Advance search is not available!');
    }).finally(()=>{
      this.loading = false;
    });
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
    this.dialog.open(PokeStatsComponent, {
      data: {
        name: name,
        image: this.pokemonImages[name],
        stats: this.pokemonStats[name],
        type: this.pokemonType[name],
        id: this.pokemonIDs[name]
      },
      panelClass: 'no-padding'
    });
  }

  openSnackBar(msg:any) {
    this._snackBar.open(msg, 'close', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 3000
    });
  }

  imgLoaded( name:any ) {
    this.imgStatus[ name ] = true;
  }

  closePokedex() {
    this.router.navigate(['']);
  }
}