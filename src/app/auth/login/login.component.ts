import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import swal from 'sweetalert2';
// modelos
import { Usuario } from '../../models/persona/usuario.model';
// servicios
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  contenedor: any;
  pantalla: number;
  tamanoPantalla: number;

  usuario: Usuario;
  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    this.tamanoPantalla = screen.height;
    this.pantalla = this.tamanoPantalla;
    this.contenedor = document.getElementById('contenedor');
    if (this.tamanoPantalla > 850) {
      this.pantalla -= 150;
    }
    if (this.tamanoPantalla < 850 && this.tamanoPantalla > 700) {
      this.pantalla -= 200;
    }
    this.contenedor.style.height = `${this.pantalla}px`;
    this.verificarUsuarioLogIn();
  }

  verificarUsuarioLogIn = () => {
    if (this.authService.isAuthenticated()) {
      swal.fire({
        position: 'top-end',
        icon: 'info',
        title: `${this.authService.usuario.username} , ya estas autentificado`,
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logIn = (): void => {

    if (!this.usuario.username || !this.usuario.password) {
      swal.fire('Advertencia', 'Debe llenar los campos', 'warning');
      return;
    }
    this.showLoading();
    this.authService.logIn(this.usuario).subscribe(
      (response) => {
        swal.close();
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${this.authService.usuario.username} bienvenido`,
          showConfirmButton: false,
          timer: 1500,
        });
        this.dismissLoading();
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.dismissLoading();
        if (error.status === 400) {
          swal.fire('Error', 'Usuario o clave incorrecta', 'error');
        }
      }
    );
  }

  showLoading = (): void => {
    swal.showLoading();
  }

  dismissLoading = (): void => {
    swal.close();
  }

}
