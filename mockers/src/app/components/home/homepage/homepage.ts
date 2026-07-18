import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly checkSubscription = inject(CheckSubscription);

  /** ✅ This variable can be passed to child components */
  isPremiumUser: boolean = false;

  ngOnInit(): void {
    this.title.setTitle('CrackCET | MHT CET Mock Tests & Practice');
    this.meta.updateTag({ name: 'description', content: 'Practice MHT CET with full-length mock tests, chapter-wise MCQs, detailed solutions, and exam-style analytics on CrackCET.' });
    this.meta.updateTag({ name: 'keywords', content: 'MHT CET, CET mock tests, online practice, Maharashtra CET, engineering entrance exam prep' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'author', content: 'CrackCET' });
    this.meta.updateTag({ property: 'og:title', content: 'CrackCET | MHT CET Mock Tests & Practice' });
    this.meta.updateTag({ property: 'og:description', content: 'Practice MHT CET with full-length mock tests, chapter-wise MCQs, detailed solutions, and exam-style analytics on CrackCET.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: 'https://s3.ap-south-1.amazonaws.com/www.mockers.com/assets/web-images/banner.webp' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'CrackCET | MHT CET Mock Tests & Practice' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Practice MHT CET with full-length mock tests, chapter-wise MCQs, detailed solutions, and exam-style analytics on CrackCET.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://s3.ap-south-1.amazonaws.com/www.mockers.com/assets/web-images/banner.webp' });

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
