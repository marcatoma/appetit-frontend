import { Producto } from './producto';

export class ProductoCombo {
  id: number;
  producto: Producto;
  cantidad: number = 1;
}
