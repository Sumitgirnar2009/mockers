import { CommonModule, NgIf } from '@angular/common';
import { Component, effect } from '@angular/core';
import { UserService } from '../../../service/logged-in-user-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  user: any;
  isAuthenticated: any;
  isMenuOpen = false; // controls mobile menu
  oidcSecurityService: any;

  constructor(private userService: UserService) {
    // assign signals/observables from service
    this.user = this.userService.user;
    this.isAuthenticated = this.userService.isAuthenticated;

    console.log(this.user());
    console.log(this.isAuthenticated());
  }

  login() {
    this.userService.login();
  }
  logout(): void {
    this.userService.logout();
  }
}
