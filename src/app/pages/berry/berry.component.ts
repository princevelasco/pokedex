import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-berry',
  templateUrl: './berry.component.html',
  styleUrls: ['./berry.component.scss']
})
export class BerryComponent implements OnInit {
  cols: any = 3;
  berryList: any;
  breakpointSub: any;

  firstLoad: boolean = true;

  constructor(
    private api: ApiService,
    public breakpointObserver: BreakpointObserver
  ) { 
    this.breakpointSub = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large]).subscribe(()=>{
      if( this.breakpointObserver.isMatched(Breakpoints.Small) ) {
        this.cols = 1;
      }
      if( this.breakpointObserver.isMatched(Breakpoints.Medium) ) {
        this.cols = 2;
      } 
      if( this.breakpointObserver.isMatched(Breakpoints.Large) ) {
        this.cols = 3;
      }
    })
  }

  ngOnInit(): void {
    this.berryList = new BerrySource(this.api);
    console.log(this.berryList, this.berryList['loading'])
    setTimeout(() => {
      this.firstLoad = false;
    }, 2000);
  }

  ngOnDestroy(){
    this.breakpointSub.unsubscribe();
  }
}

export class BerrySource extends DataSource<string | undefined> {
  berryList: any = [];
  totalBerry: any = 0;
  nextURL: any = '';
  pageSize: any = 10; 
  pageLoaded: any = new Set<number>(); 
  loading: boolean = false;

  storedBerry = Array.from<string>({ length: this.totalBerry });
  private readonly dataStream = new BehaviorSubject<(string | undefined)[]>(
    this.storedBerry
  );
  private readonly sub = new Subscription();

  constructor(
    private api: ApiService
  ){
    super();
    this.loadBerry();
  }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<(string | undefined)[]> {
    this.sub.add(
      collectionViewer.viewChange.subscribe((range) => {
        const startPage = this.pageIndex(range.start);
        const endPage = this.pageIndex(range.end - 1);

        for (let i = startPage; i <= endPage; i++) {
          this.loadNewBerry(i);
        }
      })
    );
    return this.dataStream;
  }

  disconnect(): void {
    this.sub.unsubscribe();
  }

  private pageIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private loadNewBerry(page: number) {
    if (this.pageLoaded.has(page)) {
      return;
    }
    this.pageLoaded.add(page);
    this.loadBerry();
  }

  loadBerry() {
    this.loading = true;
    this.api.call( (this.nextURL ? this.nextURL : `https://pokeapi.co/api/v2/berry?limit=10&offset=0`), "", "GET" ).then((response)=>{
      let res = response ? JSON.parse(response) : [];
      this.nextURL = res['next'];
      this.totalBerry = res['count'];
      res['results'].map((data:any)=>{
        this.getBerryDetailURL(data['url']);
      });
    }).catch((error)=>{
      console.log(error)
    }).finally(()=>{
      this.loading = false;
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
    }).catch((error)=>{
      console.log(error)
    }).finally(()=>{
      this.dataStream.next(this.berryList);
    });
  }
}