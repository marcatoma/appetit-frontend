import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
// modelos
import { Role } from 'src/app/models/persona/role.model';
import { Sexo } from 'src/app/models/persona/sexo.model';
import { Usuario } from 'src/app/models/persona/usuario.model';
// servicios
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { MensajesAlertaService } from '../../../services/mensajes-alerta.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.css'],
})
export class FormularioUsuarioComponent implements OnInit {

  @ViewChild('miForm') miForm!: NgForm;

  usuario: Usuario = new Usuario();
  erroresBackend: String[] = [];
  generos: Sexo[] = [];
  roles: Role[] = [];
  role: Role;
  confirmarPassword: string = '';
  coinsidenPassword: boolean = true;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private mensajesService: MensajesAlertaService
  ) {}

  ngOnInit(): void {
    this.listarRoles();
    this.listarSexos();
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = +params.get('id');
      if (id) {
        this.buscarUsuarioId(id);
      }
    });
  }

  registrarUsuario(): void {
    if (this.camposCompletos()) {
      // confirmacion de compararContraseñas
      if (this.compararContrasenas()) {
        // eliminar espacios en email, usuario
        this.usuario.email = this.usuario.email.replace(' ', '');
        this.usuario.username = this.usuario.username.replace(' ', '');
        console.log(this.usuario);
        this.usuarioService.registrarUsuario(this.usuario).subscribe(
          (res) => {
            console.log(res);
            this.mensajesService.mensajeSweetInformacion('success', res.mensaje, 'top-end');
            // resetear variables al guardar
            this.usuario = new Usuario();
            this.role = undefined;
            this.coinsidenPassword = true;
            this.confirmarPassword = '';
            this.erroresBackend = [];
            this.miForm.reset();
          },
          (err) => {
            if (err.status === 409) {
              this.erroresBackend = err.error.mensaje as string[];
              console.log('mensaje en ts');
              console.log(this.erroresBackend);
            }
          }
        );
      } else {
        this.coinsidenPassword = false;
      }
    } else {
      this.mensajesService.mensajeSweetFire('warning',
                                            'Llenar los campos con almenos 3 caracteres y seleccionar todas las opciones.',
                                            'Observación'
                                          );
    }
  }

  actualizarUsuario(): void {
    console.log('actualizando');
    if (this.camposCompletos()) {
      this.usuario.email = this.usuario.email.replace(' ', '');
      this.usuario.username = this.usuario.username.replace(' ', '');
      console.log(this.usuario);
      this.usuarioService.actualizarUsuario(this.usuario).subscribe(
        (res) => {
          console.log(res);
          this.mensajesService.mensajeSweetInformacion('success', res.mensaje, 'top-end');
          this.miForm.reset();
          // regresar a listado de usuarios
          this.router.navigate(['/dashboard/usuarios/page/0']);
        },
        (err) => {
          if (err.status === 409) {
            this.erroresBackend = err.error.mensaje as string[];
            console.log('mensaje en ts');
            console.log(this.erroresBackend);
          }
        }
      );
    } else {
      this.mensajesService.mensajeSweetFire('warning', 
                                            'Llenar los campos con almenos 3 caracteres y seleccionar todas las opciones.', 
                                            'Observación'
                                          );
    }
  }

  listarRoles(): void {
    this.usuarioService.obtenerusuarioRoles().subscribe((res) => {
      console.log(res);
      this.roles = res;
    });
  }

  listarSexos(): void {
    this.usuarioService.obtenerUsuarioGeneros().subscribe((res) => {
      console.log(res);
      this.generos = res;
    });
  }

  buscarUsuarioId(id: number): void {
    this.usuarioService.obtenerUsuarioId(id).subscribe((res) => {
      console.log(res);
      this.usuario = res;
    });
  }

  camposCompletos(): boolean {
    let band;
    let u = this.usuario;
    if (
      u.email.length < 3 ||
      u.nombre.length < 3 ||
      u.password.length < 3 ||
      u.roles == null ||
      u.sexo == null ||
      u.username.length < 3 ||
      this.confirmarPassword.length < 3
    ) {
      band = false;
    } else {
      band = true;
    }
    return band;
  }

  //  regresamos a la url anterior
  regresar = () => history.back();
  
  // compararContraseñas
  compararContrasenas(): boolean {
    let band: boolean;
    if (this.usuario.password === this.confirmarPassword) {
      this.coinsidenPassword = true;
      band = true;
    } else {
      this.coinsidenPassword = false;
      band = false;
    }
    return band;
  }

  // comparar-validar datos de roles en boostrap
  compararRole(o1: Role, o2: Role): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }

  // comparar-validar datos de categorias en boostrap
  compararGenero(o1: Sexo, o2: Sexo): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }
}
