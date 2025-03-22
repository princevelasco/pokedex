import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('slideLines', [
      transition(':enter', [
        style({ width: 0 }),
        animate('2s', style({ width: '100%' })),
      ]),
    ]),
    trigger('showText', [
      state('show', style({
        "margin-left": 0,
        display: 'block'
      })),
      transition('none => show', [
        animate('1s')
      ]),
    ]),
    trigger('showPokemon', [
      state('show', style({
        opacity: 1
      })),
      transition('none => show', [
        animate('1s')
      ]),
    ]),
  ]
})

export class HomeComponent implements OnInit {
  column: number = 3;
  row: string = '90%';
  show: any = {
    text: false,
    image: false
  }

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void { 
    localStorage.removeItem('accessToken');
  }

  animationDone(event:any, type: any) {
    switch (type) {
      case 'line':
          this.show['text'] = true;
        break;
      case 'text':
          this.show['image'] = event.toState == 'show' ? true : false;
        break;
    }
  }

  openLogin() {
    this.router.navigate(['/login']);
  }

}