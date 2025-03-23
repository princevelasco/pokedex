import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-berry-detail',
  templateUrl: './berry-detail.component.html',
  styleUrls: ['./berry-detail.component.scss']
})
export class BerryDetailComponent implements OnInit {
  @Input() details: any;

  constructor() { }

  ngOnInit(): void {
  }

}
