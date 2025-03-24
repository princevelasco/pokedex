import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    username: new FormControl( environment.TEMP_USER, [ Validators.required, Validators.email ] ),
    password: new FormControl( environment.TEMP_PASS, Validators.required )
  })

  loading: boolean = true;
  passwordHide: boolean = true;

  constructor(
    private _snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // go back to home page
  backToHomePage() {
    this.router.navigate(['']);
  }
  
  // process login form
  submit() {
    if( this.form.invalid ) return;
    // fake authentication
    if( this.form.controls['username'].value == environment.TEMP_USER && this.form.controls['password'].value == environment.TEMP_PASS ) {
      let fakeToken = (Math.floor(Math.random() * 9) + 1).toString().repeat(9);
      localStorage.setItem('accessToken',fakeToken);
      this.router.navigate(['/pokemon']);
    } else {
      this.openSnackBar('Invalid Credentials');
    }
  }

  // open toast msg
  openSnackBar(msg:any) {
    this._snackBar.open(msg, 'close', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 3000
    });
  }

}