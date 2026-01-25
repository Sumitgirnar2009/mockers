import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Carousel } from "../carousel/carousel";
import { MockTestDisplay } from "../mock-test-display/mock-test-display";
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CheckSubscription } from '../../../service/check-subscription';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [Navbar, Carousel, MockTestDisplay],
  templateUrl: './homepage.html',
})
export class Homepage implements OnInit {

  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly checkSubscription = inject(CheckSubscription);

  /** ✅ This variable can be passed to child components */
  isPremiumUser: boolean = false;

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$
      .subscribe(auth => {
        if (auth.isAuthenticated) {
          this.loadSubscriptionStatus();
        }
      });
  }

  private loadSubscriptionStatus(): void {
    this.oidcSecurityService.userData$
      .subscribe(userData => {
        const username = userData?.userData?.username;
        if (!username) return;

        this.checkSubscription
          .checkUserSubscription(username)
          .subscribe(isPremium => {
            this.isPremiumUser = isPremium;
            console.log("isPremium",isPremium)
          });
      });
  }
}
