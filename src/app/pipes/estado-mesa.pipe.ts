import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoMesa'
})
export class EstadoMesaPipe implements PipeTransform {

  transform(estado: boolean): string {
    return estado ? 'Activa' : 'Inactiva';
  }

}
