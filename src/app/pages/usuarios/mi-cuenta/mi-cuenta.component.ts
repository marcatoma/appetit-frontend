import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ValidatorService } from '../../../services/usuarios/validator.service';
import { PasswordRecovery, UserNameRecovery } from '../../../models/persona/user-perfil.model';
import { UsuarioPerfilService } from '../../../services/usuarios/usuario-perfil.service';
import { MensajesAlertaService } from '../../../services/mensajes-alerta.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css']
})
export class MiCuentaComponent implements OnInit {
  public usuarioMSgError: string = '';
  public msgErrorContraAct: string = '';
  public msgErrorContraNue: string = '';
  public msgErrorContraCon: string = '';
  public userName: string = this._authService.usuario.username;

  public modalReference: NgbModalRef;
  public miForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _modalService: NgbModal,
    private _vsService: ValidatorService,
    private _perfilService: UsuarioPerfilService,
    private _authService: AuthService,
    private _mensajesService: MensajesAlertaService
  ) {
    this.initForm();
    this._vsService.miForm = this.miForm;
  }

  ngOnInit(): void {
  }

  initForm = () => {
    this.miForm = this._fb.group({
      usuario:          [ this.userName || '' , [Validators.required, Validators.minLength(4)]],
      contraActual:   [ , [Validators.required, Validators.minLength(6)], ],
      contraNueva:    [ , [Validators.required, Validators.minLength(6)]],
      contraConfirm:  [ , [Validators.required]],
    }, {
      validators: [this._vsService.camposIguales('contraNueva', 'contraConfirm')]
    });
  }

  editUsuario = () => {
    if(this.miForm.get('usuario').valid && this.miForm.get('contraActual').valid){
      const {usuario, contraActual} = this.miForm.value;
      const recoveryUsername = new UserNameRecovery();
      recoveryUsername.newUsername = usuario;
      recoveryUsername.password = contraActual;
      console.log(recoveryUsername);
      this._perfilService.recoveryUserName(recoveryUsername, this._authService.usuario.id)
                          .subscribe( res => {
                            this._mensajesService.mensajeSweetFireToast('success', res.mensaje, 'top-end');
                            this._authService.usuario.username = usuario;
                            this.userName = usuario;
                            this.cerrarModalUsuario();
                          }, error => {
                            this._mensajesService.mensajeSweetFire('warning', error.error.error, '');
                          });
    } else {
      this.miForm.get('usuario').markAsTouched();
      this.miForm.get('contraActual').markAsTouched();
    }
  }
  editPassword = () => {
    if(this.miForm.get('contraActual').valid && this.miForm.get('contraNueva').valid && this.miForm.get('contraConfirm').valid){
      let recovery = new PasswordRecovery();
      const { contraActual, contraNueva} = this.miForm.value;
      recovery.id = this._authService.usuario.id;
      recovery.newPassword = contraNueva;
      recovery.oldPassword = contraActual;
      this._perfilService.recoveryPassword(recovery)
                          .subscribe( res => {
                            this._mensajesService.mensajeSweetFireToast('success', res.mensaje, 'top-end');
                            this.miForm.reset();
                          }, error => {
                            this._mensajesService.mensajeSweetInformacion('warning', error.error.error, 'center');
                          });
    } else {
      this.miForm.get('contraActual').markAsTouched();
      this.miForm.get('contraNueva').markAsTouched();
      this.miForm.get('contraConfirm').markAsTouched();
    }
  }

  tieneError = (campo: string): boolean  => {
    this.usuarioMSgError   = this._vsService.usuarioErrorMsg;
    this.msgErrorContraAct = this._vsService.contActlErrorMsg;
    this.msgErrorContraNue = this._vsService.contNueErrorMsg;
    this.msgErrorContraCon = this._vsService.contConErrorMsg;
    return this._vsService.campoEsValido(campo);
  }

  abrirModalUsuario = (modalUsuario: TemplateRef<NgbModalRef>): void => {
    this.modalReference = this._modalService.open(modalUsuario);
  }
  cerrarModalUsuario = (): void => {
    this.miForm.get('usuario').setValue(this.userName || '');
    this.miForm.get('contraActual').reset();
    this.modalReference.close();
  }

  regresar = () => {
    history.back();
  }
}
