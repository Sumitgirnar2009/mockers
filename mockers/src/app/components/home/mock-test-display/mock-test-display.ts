import { Component, effect, Input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../service/logged-in-user-service';
import { Attempt } from '../../../service/handle-attempt-id';
import { QuizRecord } from '../../../models/quiz-record.model';
import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PaymentService } from '../../../service/payment-service';

@Component({
  selector: 'app-mock-test-display',
  imports: [RouterLink, NgClass, NgFor, NgIf],
  templateUrl: './mock-test-display.html',
  styleUrls: ['./mock-test-display.css']
})
export class MockTestDisplay implements OnInit {

  // Quiz IDs MHT CET 2026 15th April Morning Shift

  // pcm_fst1_quizId = '37a81c5d-6362-41e4-aaf3-9d925579f538';
  pcm_fst1_quizId_2026 = '5b555690-a017-41d0-8b8a-33232f3c5396'; // MHT CET 2026 15th April Morning Shift
  pcm_fst2_quizId_2026 = '2c0062e6-5cf3-48fb-811e-97593ff5d519'; // MHT CET 2026 15th April Evening Shift

  pcm_fst1_quizId = '9c4f2e1a-7b6d-4c8a-9a3e-0f5d6a2b8c41'; // MHT CET 2025 19th April Morning Shift
  pcm_fst2_quizId = 'd19e7b35-3f0c-4a92-b8d1-6a4c0f5e8b22'; // MHT CET 2025 19th April Evening Shift
  pcm_fst3_quizId = '7f6c8d2a-5f41-4d58-9f77-1a6f9e3b2c10'; // MHT CET 2025 20th April Morning Shift
  pcm_fst4_quizId = 'c3b91e74-8d22-4f6b-a0d4-5e9a1c7f2b63'; // MHT CET 2025 20th April Evening Shift
  pcm_fst5_quizId = 'e5c7a2d1-8b34-49f6-a1d7-3c9e5f2b8a64'; // MHT CET 2025 21st April Morning Shift
  // pcm_fst7_quizId = '3e92b4c7-8f15-4a6d-b2c9-5d7e1f3a8b64'; // MHT CET 2025 21st April Evening Shift
  // pcm_fst8_quizId = 'a7d3e9c1-4b82-4f65-91ea-2c7d5b8f1a93'; // MHT CET 2025 22nd April Morning Shift
  // pcm_fst9_quizId = '6c1f8a2d-9e74-4b31-a5d8-7f2c3e9b4a16'; // MHT CET 2025 22nd April Evening Shift
  // pcm_fst10_quizId = 'b5e7d2a9-3c84-4f16-8a2b-1d9c7e5f3a48'; // MHT CET 2025 23rd April Morning Shift
  // pcm_fst11_quizId = '1a9c5e7d-4b82-46f3-9d1a-8c2e7b5f4a63'; // MHT CET 2025 23rd April Evening Shift
  // pcm_fst12_quizId = '8d3b1f6a-2c95-4e74-b8a1-5f7d9c3e2a64'; // MHT CET 2025 25th April Morning Shift
  // pcm_fst13_quizId = '4f8a2d7c-1b63-49e5-a7d2-9c4e1f8b3a65'; // MHT CET 2025 25th April Evening Shift
  // pcm_fst14_quizId = 'c2e7a4d9-8f13-4b65-91ac-7d3e5f2a8b64'; // MHT CET 2025 26th April Morning Shift
  // pcm_fst15_quizId = '9b4d1e7a-5c82-46f3-a8d1-2e7c5f9a3b64'; // MHT CET 2025 26th April Evening Shift
  // pcm_fst16_quizId = 'e5c7a2d1-8b34-49f6-a1d7-3c9e5f2b8a64'; // MHT CET 2025 5th May Evening Shift
    pcm_fst6_quizId = '37a81c5d-6362-41e4-aaf3-9d925579f538'; // random

  // User + Attempt signals
  username!: string;
  attemptId = signal<string>('');
  startTime = signal<string>('');
  attemptModel = signal<Attempt | null>(null);
  isLoggedIn = signal<boolean>(false);

  selectedQuiz = signal<QuizRecord | null>(null);
  showSubscribeModal = signal<boolean>(false);
  isRedirectingToPayment = signal<boolean>(false);
  @Input() isPremiumUser!: boolean;



  // Quiz Records
  quizRecords: QuizRecord[] = [
    { quizId: this.pcm_fst1_quizId_2026, quizName: 'MHT CET 2026 15th April Morning Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    { quizId: this.pcm_fst2_quizId_2026, quizName: 'MHT CET 2026 15th April Evening Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    { quizId: this.pcm_fst1_quizId, quizName: 'MHT CET 2025 19th April Morning Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    { quizId: this.pcm_fst2_quizId, quizName: 'MHT CET 2025 19th April Evening Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    { quizId: this.pcm_fst3_quizId, quizName: 'MHT CET 2025 20th April Morning Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    { quizId: this.pcm_fst4_quizId, quizName: 'MHT CET 2025 20th April Evening Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    { quizId: this.pcm_fst5_quizId, quizName: 'MHT CET 2025 21st April Morning Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    { quizId: this.pcm_fst6_quizId, quizName: 'Mock Test', quizType: 'free', isProgress: false, attemptNo: 1 },
    // { quizId: this.pcm_fst7_quizId, quizName: 'MHT CET 2025 21st April Evening Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    // { quizId: this.pcm_fst8_quizId, quizName: 'MHT CET 2025 22nd April Morning Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    // { quizId: this.pcm_fst9_quizId, quizName: 'MHT CET 2025 22nd April Evening Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    // { quizId: this.pcm_fst10_quizId, quizName: 'MHT CET 2025 23rd April Morning Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    // { quizId: this.pcm_fst11_quizId, quizName: 'MHT CET 2025 23rd April Evening Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    // { quizId: this.pcm_fst12_quizId, quizName: 'MHT CET 2025 25th April Morning Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    // { quizId: this.pcm_fst13_quizId, quizName: 'MHT CET 2025 25th April Evening Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    // { quizId: this.pcm_fst14_quizId, quizName: 'MHT CET 2025 26th April Morning Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    // { quizId: this.pcm_fst15_quizId, quizName: 'MHT CET 2025 26th April Evening Shift', quizType: 'free', isProgress: false, attemptNo: 1 },
    // { quizId: this.pcm_fst16_quizId, quizName: 'MHT CET 2025 5th May Evening Shift', quizType: 'free', isProgress: false, attemptNo: 1 },

  ];
  private readonly attemptsUrl = 'https://3xwi0sy6xk.execute-api.ap-south-1.amazonaws.com/dev1';

  constructor(
    private userService: UserService,
    private oidcSecurityService: OidcSecurityService,
    private http: HttpClient,
    private router: Router,
    private paymentService: PaymentService
  ) {
    // Reactively handle user login state
    effect(() => {
      const user = this.userService.user();
      if (user) {
        this.username = user.username;
        this.isLoggedIn.set(true);
        console.log('✅ Logged in as:', this.username);
        this.loadQuizAttempts();
      } else {
        this.isLoggedIn.set(false);
      }
    });

    effect(() => {
      if (this.showSubscribeModal()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });



  }

  ngOnInit(): void { }

  /**
   * Handles quiz start/continue button click
   */
  onQuizAction(quiz: QuizRecord): void {
    if (!this.isLoggedIn()) {
      alert('⚠️ Please login first to start the test.');
      return;
    }

    // 🚫 Only non-premium users should see subscribe modal
    if (quiz.quizType === 'subscription' && !this.isPremiumUser) {
      this.onSubscribe(quiz);
      return;
    }

    // ✅ Free OR premium user → start test
    this.router.navigate(['/instructions', quiz.quizId]);
  }






  /**
   * Fetch attempt info for each quiz
   */
  private loadQuizAttempts(): void {
    const observables: Observable<any>[] = this.quizRecords.map(quiz => {
      return this.getApiToken().pipe(
        switchMap(token => {
          const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
          const params = new HttpParams()
            .set('username', this.username)
            .set('quizId', quiz.quizId);

          return this.http.get<{ attempts: Attempt[], inProgress: boolean }>(this.attemptsUrl, { headers, params });
        }),
        map(response => {
          const attempts = response.attempts || [];
          const completedAttemptsCount = attempts.filter(a => a.status === 'completed').length;
          const inProgressAttempt = attempts.find(a => a.status === 'inprogress');

          quiz.isProgress = !!inProgressAttempt;
          quiz.attemptNo = completedAttemptsCount + 1;

          console.log(`✅ ${quiz.quizName}: Completed ${completedAttemptsCount}, InProgress ${quiz.isProgress}, AttemptNo ${quiz.attemptNo}`);
        })
      );
    });

    forkJoin(observables).subscribe({
      next: () => console.log('✅ All quizzes updated'),
      error: err => console.error('❌ Error fetching attempts:', err)
    });
  }

  /**
   * Retrieves ID Token for Authorization
   */
  private getApiToken(): Observable<string> {
    return this.oidcSecurityService.getIdToken().pipe(
      map((idToken: string) => {
        if (!idToken) throw new Error('No ID Token available. Please login again.');
        return idToken;
      })
    );
  }



  onSubscribe(quiz: QuizRecord): void {
    this.selectedQuiz.set(quiz);
    this.showSubscribeModal.set(true);
  }

  closeSubscribeModal(): void {
    this.showSubscribeModal.set(false);
    this.selectedQuiz.set(null);
    this.isRedirectingToPayment.set(false); // Add this line
  }

  verifySubscriptionPayment(response: any): void {
    const payload = {
      razorpayPaymentId: response.razorpay_payment_id,
      razorpayOrderId: response.razorpay_order_id,
      razorpaySignature: response.razorpay_signature,
      username: this.username
    };

    this.paymentService.verifySubscriptionPayment(payload)
      .subscribe({
       next: (res) => {
  console.log('✅ Subscription activated', res);

  // 🔴 IMPORTANT
  this.isRedirectingToPayment.set(false);
  this.showSubscribeModal.set(false);
  document.body.style.overflow = '';

  this.showSuccessModal();
},
        error: (err) => {
          console.error('❌ Payment verification failed', err);
          this.isRedirectingToPayment.set(false); // Add this line
          alert('Payment verification failed');
        }
      });
  }

  showSuccessModal(): void {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
  `;

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

    // Success icon with animation
    const icon = document.createElement('div');
    icon.innerHTML = `
    <svg width="80" height="80" viewBox="0 0 80 80" style="margin: 0 auto 20px;">
      <circle cx="40" cy="40" r="36" fill="#10b981" opacity="0.2"/>
      <circle cx="40" cy="40" r="36" fill="none" stroke="#10b981" stroke-width="4"
              stroke-dasharray="226" stroke-dashoffset="226"
              style="animation: drawCircle 0.6s ease-out 0.2s forwards;"/>
      <path d="M 25 40 L 35 50 L 55 30" fill="none" stroke="white" stroke-width="4"
            stroke-linecap="round" stroke-linejoin="round"
            stroke-dasharray="50" stroke-dashoffset="50"
            style="animation: drawCheck 0.4s ease-out 0.6s forwards;"/>
    </svg>
  `;

    // Content
    const content = document.createElement('div');
    content.innerHTML = `
    <h2 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0;">
      🎉 Congratulations!
    </h2>
    <p style="font-size: 18px; color: #6b7280; margin: 0 0 24px 0; line-height: 1.6;">
      You are now a <strong style="color: #10b981;">subscribed user</strong>
    </p>
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%);
                padding: 20px; border-radius: 12px; margin-bottom: 24px;">
      <p style="font-size: 16px; color: #065f46; margin: 0; font-weight: 500;">
        ✨ You now have access to all professional mock tests
      </p>
    </div>
    <button id="continueBtn" style="
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      padding: 14px 32px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    ">
      Continue to Dashboard →
    </button>
  `;

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    @keyframes drawCircle {
      to { stroke-dashoffset: 0; }
    }
    @keyframes drawCheck {
      to { stroke-dashoffset: 0; }
    }
    #continueBtn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }
    #continueBtn:active {
      transform: translateY(0);
    }
  `;

    // Assemble modal
    document.head.appendChild(style);
    modal.appendChild(icon);
    modal.appendChild(content);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // Add confetti effect (optional)
    this.createConfetti();

    // Handle continue button
    const continueBtn = document.getElementById('continueBtn');
  continueBtn?.addEventListener('click', () => {
  backdrop.style.animation = 'fadeOut 0.3s ease-out';

  setTimeout(() => {
    backdrop.remove();

    // ✅ UNLOCK BODY SCROLL
    document.body.style.overflow = '';

    // ✅ NAVIGATE
    this.router.navigate(['/home']);
  }, 300);
});


    // Add fadeOut animation
    style.textContent += `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  }

  createConfetti(): void {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      top: -10px;
      left: ${Math.random() * 100}%;
      opacity: 0;
      z-index: 10000;
      animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
      animation-delay: ${Math.random() * 0.5}s;
    `;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 4000);
    }

    const style = document.createElement('style');
    style.textContent = `
    @keyframes confettiFall {
      0% {
        opacity: 1;
        transform: translateY(0) rotate(0deg);
      }
      100% {
        opacity: 0;
        transform: translateY(100vh) rotate(720deg);
      }
    }
  `;
    document.head.appendChild(style);
  }

  startPayment(): void {

    // 🚫 Guard: User must be logged in
    if (!this.isLoggedIn()) {
      alert('⚠️ Please login to start the test and proceed with payment.');
      this.showSubscribeModal.set(false);
      return;
    }

    // Show loading notification
    this.isRedirectingToPayment.set(true);

    const amount = 1 * 100; // ₹999 subscription

    this.paymentService
      .createRazorpayOrder(amount, this.username)
      .subscribe({
        next: (order) => {
          setTimeout(() => {
            const options: any = {
              key: 'rzp_live_RwikgNB9m7itAJ',
              amount: order.amount,
              currency: 'INR',
              name: 'Crack CET',
              description: 'MHT-CET Full Test Series',
              order_id: order.id,

              handler: (response: any) => {
                this.verifySubscriptionPayment(response);
              },

              modal: {
                ondismiss: () => {
                  this.isRedirectingToPayment.set(false);
                  this.showSubscribeModal.set(false);
                  console.log('Payment cancelled by user');
                }
              }
            };

            new (window as any).Razorpay(options).open();

            setTimeout(() => {
              this.showSubscribeModal.set(false);
              this.isRedirectingToPayment.set(false);
            }, 500);

          }, 800);
        },
        error: (err) => {
          console.error('❌ Order creation failed', err);
          this.isRedirectingToPayment.set(false);
          alert('Failed to create order. Please try again.');
        }
      });
  }







}
