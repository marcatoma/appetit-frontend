import { MedioPago } from './medio-pago';
import { Pedido } from '../pedidos/pedido';
import { Usuario } from '../persona/usuario.model';

export class Movimiento {
  id: number;
  monto: number = 0.0;
  usuario: Usuario = null;
  descripcion: string = '';
  pedido: Pedido = null;
  tipoPago: MedioPago;
  fecha: Date;
  fechaMovimiento: Date;
  estado: boolean;
  monto_entregado: number = 0.0;
  cambio_usuario: number = 0.0;
}
