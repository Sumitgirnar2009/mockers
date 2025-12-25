import { Component, inject } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Carousel } from "../carousel/carousel";
import { RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MockTestDisplay } from "../mock-test-display/mock-test-display";

@Component({
  selector: 'app-homepage',
  imports: [Navbar, Carousel, MockTestDisplay],
  templateUrl: './homepage.html',
})
export class Homepage {

  
  private readonly oidcSecurityService = inject(OidcSecurityService);
  userData$ = this.oidcSecurityService.userData$;
 isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
}
