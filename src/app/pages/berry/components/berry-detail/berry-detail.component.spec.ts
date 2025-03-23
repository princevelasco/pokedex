import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BerryDetailComponent } from './berry-detail.component';

describe('BerryDetailComponent', () => {
  let component: BerryDetailComponent;
  let fixture: ComponentFixture<BerryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BerryDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BerryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
