import { CdkPortal } from '@angular/cdk/portal';
import { ApiService } from 'src/app/core/services/api.service';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Subscription, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-berry',
  templateUrl: './berry.component.html',
  styleUrls: ['./berry.component.scss']
})
export class BerryComponent implements OnInit {
  @ViewChild(CdkPortal) portal!: CdkPortal;

  cols: any = 3;
  berryList: any;
  breakpointSub: any;
  details: any = [];
  firstLoad: boolean = true;

  unsubscribe = new Subject<void>();

  constructor(
    private api: ApiService,
    private breakpointObserver: BreakpointObserver,
    private overlay: Overlay
  ) { 
    this.breakpointSub = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large]).pipe(takeUntil(this.unsubscribe)).subscribe(()=>{
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
    setTimeout(() => {
      this.firstLoad = false;
    }, 2000);
  }

  // show overlay berry detail
  moreDetails(data:any) {
    const config = new OverlayConfig({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      width: '60%',
      hasBackdrop: true
    })
    this.details = data;
    const overlayRef = this.overlay.create(config);
    overlayRef.attach(this.portal);
    overlayRef.backdropClick().subscribe(()=> overlayRef.detach())
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

  // observer scroll
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

  // unsubscribe
  disconnect(): void {
    this.sub.unsubscribe();
  }

  // get page index
  private pageIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  // fecth new berry list
  private loadNewBerry(page: number) {
    if (this.pageLoaded.has(page)) {
      return;
    }
    this.pageLoaded.add(page);
    this.loadBerry();
  }

  // fetch berry list
  loadBerry() {
    this.loading = true;
    this.api.call( (this.nextURL ? this.nextURL : `https://pokeapi.co/api/v2/berry?limit=12&offset=0`), "", "GET" ).then((response)=>{
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

  // fetch berry url that will be used to get the berry detail
  getBerryDetailURL(url:any) {
    this.api.call( url, "", "GET" ).then((response)=>{
      let res = response ? JSON.parse(response) : [];
      this.getBerryDetail( res['item']['url'] );
    })
  }

  // fetch the berry details
  getBerryDetail(url:any) {
    this.api.call( url, "", "GET" ).then((response)=>{
      let res = response ? JSON.parse(response) : [];
      this.berryList.push({ 
        name: res['name'], 
        effects: res['effect_entries']['0']['effect'], 
        sprite: res['sprites']['default'],
        shorts: res['effect_entries']['0']['short_effect'],
        flavor: res['flavor_text_entries']['0']['text'],
        cost: res['cost']
      });
    }).catch((error)=>{
      console.log(error)
    }).finally(()=>{
      this.dataStream.next(this.berryList);
    });
  }
}