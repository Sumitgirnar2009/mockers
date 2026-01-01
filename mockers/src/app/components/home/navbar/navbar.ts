import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { UserService } from '../../../service/logged-in-user-service';
import { authConfig, cognitoHostedUIDomain } from '../../../auth/auth.config';
import { Subscription } from 'rxjs';

interface Notification {
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  icon: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {
  user: any;
  isAuthenticated: any;
  isMenuOpen = false;
  isScrolled = false;
  
  // Notification properties
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'warning' | 'danger' = 'success';
  notificationIcon = '';
  private notificationTimeout: any;
  private userSubscription!: Subscription;
  private authSubscription!: Subscription;

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
    // Subscribe to user changes to detect login/logout
    this.setupUserSubscription();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
  }

  /**
   * Setup subscription to detect authentication state changes
   */
  private setupUserSubscription(): void {
    // This assumes UserService has a way to observe changes
    // If using Signals, you might need a different approach
    // For example, using effect() or manual checks
    
    // Example with interval check (fallback if no observable available)
    let previousAuthState = this.isAuthenticated();
    
    // Check every 500ms for auth state changes
    const checkInterval = setInterval(() => {
      const currentAuthState = this.isAuthenticated();
      if (currentAuthState !== previousAuthState) {
        this.handleAuthStateChange(currentAuthState, previousAuthState);
        previousAuthState = currentAuthState;
      }
    }, 500);

    // Store interval ID for cleanup
    (this as any).authCheckInterval = checkInterval;
  }

  /**
   * Handle authentication state changes
   */
  private handleAuthStateChange(
    currentState: boolean, 
    previousState: boolean
  ): void {
    if (currentState && !previousState) {
      // User logged in
      this.showLoginNotification();
    } else if (!currentState && previousState) {
      // User logged out
      this.showLogoutNotification();
    }
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
   * Show login success notification
   */
  private showLoginNotification(): void {
    const username = this.user()?.preferred_username || 
                     this.user()?.username || 
                     'User';
    
    this.notificationMessage = `Welcome back, ${username}! You have successfully logged in.`;
    this.notificationType = 'success';
    this.notificationIcon = 'bi bi-check-circle-fill';
    this.showNotification = true;
    
    this.autoDismissNotification();
  }

  /**
   * Show logout notification
   */
  private showLogoutNotification(): void {
    this.notificationMessage = 'You have been successfully logged out.';
    this.notificationType = 'info';
    this.notificationIcon = 'bi bi-info-circle-fill';
    this.showNotification = true;
    
    this.autoDismissNotification();
  }

  /**
   * Auto-dismiss notification after delay
   */
  private autoDismissNotification(delay: number = 5000): void {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    
    this.notificationTimeout = setTimeout(() => {
      this.dismissNotification();
    }, delay);
  }

  /**
   * Manually dismiss notification
   */
  dismissNotification(): void {
    // Add fade-out animation
    const notificationElement = document.querySelector('.notification-container');
    if (notificationElement) {
      notificationElement.classList.add('fade-out');
      
      setTimeout(() => {
        this.showNotification = false;
        if (notificationElement) {
          notificationElement.classList.remove('fade-out');
        }
      }, 300);
    } else {
      this.showNotification = false;
    }
  }

  /**
   * Handle login action with notification
   */
  login(): void {
    // Show login in progress notification
    this.notificationMessage = 'Redirecting to login...';
    this.notificationType = 'info';
    this.notificationIcon = 'bi bi-arrow-right-circle-fill';
    this.showNotification = true;
    
    this.autoDismissNotification(3000);
    
    // Proceed with login
    this.userService.login();
  }

  /**
   * Handle logout action with notification
   */
  logout(): void {
    // Show logout in progress notification
    this.notificationMessage = 'Logging out...';
    this.notificationType = 'info';
    this.notificationIcon = 'bi bi-box-arrow-right';
    this.showNotification = true;
    
    // Perform logout
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

  /**
   * Computed property for notification CSS class
   */
  get notificationClass(): string {
    return `alert-${this.notificationType}`;
  }
}