import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorPerfilFormService {

  public miForm: FormGroup;
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public nombrePattern: string = '^[a-zA-ZñÑ ]*$';
  public cedulaPattern: string = '^([0-9])[0-9][0-9]{7,8}$';
  public telefonoPattern: string = '^[0-9][0-9]{9,10}$';
  constructor() { }

  get nombreErrorMsg(): string{
    const errors = this.miForm.get('nombre')?.errors;
    if (errors?.required){
      return 'El nombre es requerido';
    } else if (errors?.minlength){
      return 'Ingrese mínimo 3 caracteres';
    } else if(errors?.pattern){
      return 'Ingrese solo letras';
    }
    return '';
  }
  get emailErrorMsg(): string{
    const errors = this.miForm.get('email')?.errors;
    if (errors?.required){
      return 'El email es requerido';
    } else if(errors?.pattern){
      return 'El email es inválido';
    }
    return '';
  }
  get cedulaErrorMsg(): string{
    const errors = this.miForm.get('cedula')?.errors;
    if (errors?.required){
      return 'La cédula es requerida';
    } else if(errors?.pattern){
      return 'La cédula es inválida';
    }
    return '';
  }
  get telefonoErrorMsg(): string{
    const errors = this.miForm.get('telefono')?.errors;
    if (errors?.required){
      return 'El teléfono es requerido';
    } else if(errors?.pattern){
      return 'El teléfono es inválido';
    }
    return '';
  }

  campoEsValido = (campo: string): boolean | null => {
    return  this.miForm.controls?.[campo].invalid
              &&
            this.miForm.controls?.[campo].touched;
  }
}
