import { Producto } from '../productos/producto';

export class DetallePedido {
  id: number;
  producto: Producto;
  cantidad: number = 1;
}
