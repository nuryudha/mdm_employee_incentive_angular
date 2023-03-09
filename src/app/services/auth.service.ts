import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  getAuthLogin(): string | null {
    return localStorage.getItem('auth-user');
    console.log()
  }

  isLoggedIn() {
    let authLogin = JSON.parse(this.getAuthLogin() || '{}');
    if (
      Object.keys(authLogin).length != 0 &&
      authLogin.token != '' &&
      authLogin.profilLocation.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }
}
