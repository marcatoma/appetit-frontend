import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
// modelos
import { Role } from '../models/persona/role.model';
// servicios
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
        return false;
      }
      let role = next.data['role'] as Array<Role>;
      for (let i = 0; i < role.length; i++) {
        if (this.authService.hasRole(role[i])) {
          return true;
        }
      }
      swal.fire({ position: 'top-end', icon: 'warning', title: `No tienes acceso a este recurso`, showConfirmButton: false, timer: 1500 });
      this.router.navigate(['/dashboard/user']);
      return false;
    }
}
