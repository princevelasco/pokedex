import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

export const fadeInOutTimeout = 250;
export const fadeInOut = trigger('fadeInOut', [
  transition('void => *', [style({ opacity: '0', transform: 'translateX(-10%)' }), animate(fadeInOutTimeout)]),
  transition('* => void', [animate(fadeInOutTimeout, style({ opacity: '0' }))]),
  transition('* => *', [
style({ opacity: '0', transform: 'translateX(-10%)' }),
animate(fadeInOutTimeout, style({ opacity: '1', transform: 'translateX(0%)' })),
  ]),
]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  column: number = 3;
  row: string = '100%';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.column = (window.innerWidth <= 400) ? 3 : 2;
    // this.row = (window.innerWidth <= 400) ? '50%' : '100%';
  }

  onResize(event:any) {
    // this.column = (event.target.innerWidth <= 400) ? 3 : 2;
    // this.row = (window.innerWidth <= 400) ? '50%' : '100%';
  }

  openPokedex() {
    this.router.navigate(['/pokedex']);
  }

}
