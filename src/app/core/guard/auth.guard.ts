import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
    ) { }

    canActivate() {
        const hasToken = localStorage.getItem('accessToken');
        if (hasToken) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to home page
        this.router.navigate(['/login']);
        return false;
    }
}
