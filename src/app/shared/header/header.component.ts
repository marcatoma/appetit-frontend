import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logOut = (): void => {
    swal.fire({ position: 'top-end', icon: 'info', title: `${this.authService.usuario.username}, Sesión cerrada`, showConfirmButton: false, timer: 1500 });
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

}
