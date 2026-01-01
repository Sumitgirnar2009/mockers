import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from '../../../service/logged-in-user-service';
import { authConfig, cognitoHostedUIDomain } from '../../../auth/auth.config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  user: any;
  isAuthenticated: any;
  isMenuOpen = false;
  isScrolled = false;

  // Environment-specific URLs
  registerUrl: string = '';
  forgotPasswordUrl: string = '';

  constructor(private userService: UserService) {
    // Assign signals/observables from service
    this.user = this.userService.user;
    this.isAuthenticated = this.userService.isAuthenticated;

    // Build URLs using auth config
    this.buildAuthUrls();

    console.log('User:', this.user());
    console.log('Is Authenticated:', this.isAuthenticated());
  }

  ngOnInit(): void {
    // Any initialization logic
  }

  /**
   * Build authentication URLs based on auth configuration
   */
  private buildAuthUrls(): void {
    const cognitoDomain = cognitoHostedUIDomain;
    const clientId = authConfig.clientId;
    const redirectUri = encodeURIComponent(authConfig.redirectUrl!);
    const scope = authConfig.scope?.replace(/ /g, '+') || 'email+openid+phone+profile';

    // Register URL
    this.registerUrl = `${cognitoDomain}/signup?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${authConfig.responseType}&scope=${scope}`;

    // Forgot Password URL
    this.forgotPasswordUrl = `${cognitoDomain}/forgotPassword?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${authConfig.responseType}&scope=${scope}`;
  }

  /**
   * Handle login action
   */
  login(): void {
    this.userService.login();
  }

  /**
   * Handle logout action
   */
  logout(): void {
    this.userService.logout();
    // Close mobile menu if open
    this.closeMobileMenu();
  }

  /**
   * Close mobile menu programmatically
   */
  private closeMobileMenu(): void {
    const navbarCollapse = document.getElementById('navbarCollapse');
    if (navbarCollapse?.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  }

  /**
   * Handle scroll event for navbar styling
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
    const navbar = document.querySelector('.navbar-custom');
    if (navbar) {
      if (this.isScrolled) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }
}