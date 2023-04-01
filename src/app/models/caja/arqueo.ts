import { Caja } from './caja';
import { Usuario } from '../persona/usuario.model';

export class Arqueo {
  id: number;
  caja: Caja;
  usuario: Usuario;
  montoInicial: number = 0.0;
  montoFinal: number = 0.0;
  efectivo: number = 0.0;
  bancos: number = 0.0;
  diferencia: number = 0.0;
  fecha: Date;
  fechaApertura: Date;
  fechaCierre: Date;
  descripcion: string = 'Apertura de caja.';
  descripcionCierre: string = '';
  isOpen: boolean;
}
