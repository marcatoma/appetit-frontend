import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
// servicios
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(e => {
                if (e.status == 401) {
                    if (this.authService.isAuthenticated()) {
                        this.authService.logOut();
                    }
                    this.router.navigate(['/login']);
                }
                if (e.status == 403) {
                    swal.fire({ position: 'top-end', icon: 'warning', title: `No tienes acceso a este recurso`, showConfirmButton: false, timer: 1500 });
                    this.router.navigate(['/dashboard']);
                }
                return throwError(e)
            })
        );
    }
}

