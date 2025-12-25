import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {

      // SESSION TIMEOUT
      if (error.status === 401 || error.status === 403) {
        sessionStorage.clear();
        localStorage.clear();
        router.navigateByUrl('/home'); // or '/login'
      }

      return throwError(() => error);
    })
  );
};
