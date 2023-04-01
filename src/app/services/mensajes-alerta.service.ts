import { Injectable } from '@angular/core';

import Swal, { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class MensajesAlertaService {

  constructor() { }
  // <-------------------------- mensajes para usuario ------------------------->
  mensajeSweetInformacion = (sweetAlertIcon: SweetAlertIcon, msg: string, pos: SweetAlertPosition): void => {
    Swal.fire({ position: pos, icon: sweetAlertIcon, text: msg, showConfirmButton: false, timer: 1500});
  }
  // toast ventana de alerta
  mensajeSweetInformacionToast = (sweetAlertIcon: SweetAlertIcon, msg: string, pos: SweetAlertPosition ): void => {
    const Toast = Swal.mixin({
      toast: true,
      position: pos,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
    Toast.fire({
      icon: sweetAlertIcon,
      title: msg
    });
  }
  mensajeSweetFireToast = (alertIcon: SweetAlertIcon, msg: string, pos: SweetAlertPosition , tim = 1500) => {
    Swal.fire({
      position: pos,
      icon: alertIcon,
      text: msg,
      showConfirmButton: false,
      timer: tim,
    });
  }
  // <-------------------------- mensajes para usuario ------------------------->
  mensajeSweetFire = (sweetAlertIcon: SweetAlertIcon, msg: string , titulo: string): void => {
    Swal.fire( titulo, msg, sweetAlertIcon);
  }

  confirmDialogSweet = (icon: SweetAlertIcon, title: string, text: string, msgButton: string) => {
    return Swal
      .fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: '#0366d6',
        cancelButtonColor: '#CE352C',
        confirmButtonText: msgButton,
        cancelButtonText: 'No, gracias',
        reverseButtons: true
      })
  }
}
