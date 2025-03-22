import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Output() toggleSide = new EventEmitter();

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  backToHome() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['']);
  }

}