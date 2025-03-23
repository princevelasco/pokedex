import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-berry',
  templateUrl: './berry.component.html',
  styleUrls: ['./berry.component.scss']
})
export class BerryComponent implements OnInit {

  berryList: any = [];
  limit: any = '15';
  firstLoad: boolean = true;
  screenSize: any = 'large';
  cols: any = {
    large: 3,
    medium: 2,
    small: 1
  }
  breakpointSub: any;

  constructor(
    private api: ApiService,
    public breakpointObserver: BreakpointObserver
  ) { 
    this.breakpointSub = this.breakpointObserver.observe([
      '(max-width: 470px)', '(max-width: 800px)'
    ]).subscribe(result=>{
      if( result.breakpoints['(max-width: 470px)'] ) {
        this.screenSize = 'small';
      } else if( result.breakpoints['(max-width: 800px)'] ) {
        this.screenSize = 'medium';
      } else {
        this.screenSize = 'large';
      }
    })
  }

  ngOnInit(): void {
    this.loadBerry();
    setTimeout(() => {
      this.firstLoad = false;
    }, 2000);
  }

  ngOnDestroy(){
    this.breakpointSub.unsubscribe();
  }

  loadBerry() {
    this.api.call( `https://pokeapi.co/api/v2/berry?limit=${this.limit}&offset=0`, "", "GET" ).then((response)=>{
      let res = response ? JSON.parse(response) : [];
      res['results'].map((data:any)=>{
        this.getBerryDetailURL(data['url']);
      });
    })
  }

  getBerryDetailURL(url:any) {
    this.api.call( url, "", "GET" ).then((response)=>{
      let res = response ? JSON.parse(response) : [];
      this.getBerryDetail( res['item']['url'] );
    })
  }

  getBerryDetail(url:any) {
    this.api.call( url, "", "GET" ).then((response)=>{
      let res = response ? JSON.parse(response) : [];
      this.berryList.push({ name: res['name'], effects: res['effect_entries']['0']['effect'], sprite: res['sprites']['default'] });
    })
  }

}
