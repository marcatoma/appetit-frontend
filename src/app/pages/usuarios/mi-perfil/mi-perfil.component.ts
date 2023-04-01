import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sexo } from '../../../models/persona/sexo.model';
import { UsuarioService } from '../../../services/usuarios/usuario.service';
import { Usuario } from '../../../models/persona/usuario.model';
import { AuthService } from '../../../services/auth/auth.service';
import { ValidatorPerfilFormService } from 'src/app/services/usuarios/validator-perfil-form.service';
import { UsuarioPerfilService } from '../../../services/usuarios/usuario-perfil.service';
import { MensajesAlertaService } from '../../../services/mensajes-alerta.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  
  public usuario: Usuario = new Usuario();
  public generos: Sexo [] = [];

  //  mensajes de errores
  public nombreMsgError: string = '';
  public emailMsgError: string = '';
  public cedulaMsgError: string = '';
  public telefonoMsgError: string = '';

  public perfilForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService,
    private _usuarioPerfilService: UsuarioPerfilService,
    private _authService: AuthService,
    private _valPerfilService: ValidatorPerfilFormService,
    private _mensajesService: MensajesAlertaService
  ) {
    this.initForm();
    this._valPerfilService.miForm = this.perfilForm;
  }
  
  ngOnInit(): void {
    this.recuperarUsuarioActual();
    this.listarGeneros();
  }

  initForm = (): void => {
    this.perfilForm = this._formBuilder.group({
      nombre: [  , [Validators.required, Validators.minLength(3), Validators.pattern(this._valPerfilService.nombrePattern)]],
      email: [ , [Validators.required, Validators.pattern(this._valPerfilService.emailPattern)]],
      cedula: [ , [Validators.required, Validators.pattern(this._valPerfilService.cedulaPattern)]],
      telefono: [ , [Validators.required, Validators.pattern(this._valPerfilService.telefonoPattern)]],
      sexo: [ , [Validators.required]],
    });
  }
  recuperarUsuarioActual = (): void =>{
    const id: number = this._authService.usuario.id;
    this._usuarioService.obtenerUsuarioIdPerfil(id)
                          .subscribe( res => {
                            this.usuario = res;
                            this.evaluarPerfilForm(this.usuario);
                          });
  }

  evaluarPerfilForm = (usuario: Usuario) => {
    this.perfilForm.setValue({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      cedula: usuario.cedula || '',
      telefono: usuario.telefono || '',
      sexo: usuario.sexo,
    });
  }
  listarGeneros(): void {
    this._usuarioService.obtenerUsuarioGeneros().subscribe((res) => {
      this.generos = res;
    });
  }

  editAccount = () => {
    if(this.perfilForm.valid){
      const { nombre, email, cedula, telefono, sexo } = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;
      this.usuario.cedula = cedula;
      this.usuario.telefono = telefono;
      this.usuario.sexo = sexo;
      this._usuarioPerfilService.updatePerfilUser(this.usuario)
                                  .subscribe(res => {
                                    this._mensajesService.mensajeSweetFireToast('success', res.mensaje, 'top-end');
                                  }, error => {
                                    if(error.status === 404){
                                      this._mensajesService.mensajeSweetFire('warning', error.error.mensaje, 'Error');
                                    } else {
                                      this._mensajesService.mensajeSweetFire('warning', 'No se pudo actualizar el perfil', 'Error');
                                    }
                                  });
    } else {
      this.perfilForm.markAllAsTouched();
    }
  }

  tieneError = (campo: string): boolean  => {
    this.nombreMsgError = this._valPerfilService.nombreErrorMsg;
    this.emailMsgError = this._valPerfilService.emailErrorMsg;
    this.cedulaMsgError = this._valPerfilService.cedulaErrorMsg;
    this.telefonoMsgError = this._valPerfilService.telefonoErrorMsg;
    return this._valPerfilService.campoEsValido(campo);
  }
  // comparar-validar datos de categorias en boostrap
  compararGenero = (o1: Sexo, o2: Sexo): boolean => {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }
  regresar = () => {
    history.back();
  }
}
