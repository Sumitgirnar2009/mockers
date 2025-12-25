import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { HttpErrorResponse } from '@angular/common/http';

bootstrapApplication(App, appConfig)
  .then(() => {
    // GLOBAL 401 HANDLER
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;

      // ⛔ Session expired OR invalid token
      if (error instanceof HttpErrorResponse && error.status === 401) {
        alert('Session timed out. Please login again.');
        window.location.href = '/';  // Redirect to homepage
      }
    });
  })
  .catch((err) => console.error(err));
