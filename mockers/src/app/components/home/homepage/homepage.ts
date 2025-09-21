import { Component, inject } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Carousel } from "../carousel/carousel";
import { RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-homepage',
  imports: [Navbar, Carousel,RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {

  
  private readonly oidcSecurityService = inject(OidcSecurityService);
  userData$ = this.oidcSecurityService.userData$;
 isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
}
