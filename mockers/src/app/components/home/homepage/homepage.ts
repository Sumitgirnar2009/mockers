import { Component, inject } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Carousel } from "../carousel/carousel";
import { RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MockTestDisplay } from "../mock-test-display/mock-test-display";

@Component({
  selector: 'app-homepage',
  imports: [Navbar, Carousel, RouterLink, MockTestDisplay],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {

  
  private readonly oidcSecurityService = inject(OidcSecurityService);
  userData$ = this.oidcSecurityService.userData$;
 isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
}
