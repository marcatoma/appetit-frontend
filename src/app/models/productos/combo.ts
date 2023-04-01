import { Categoria } from './categoria';
import { ProductoCombo } from './producto-combo';

export class Combo {
  id: number;
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0.0;
  imagen: string;
  categoria: Categoria;
  estado: boolean = false;
  especial: boolean = false;
  itemsCombo: ProductoCombo[] = [];
  infoExtra: string = '';
  saborBebida: string = '';
}
