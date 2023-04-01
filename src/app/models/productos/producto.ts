import { Categoria } from './categoria';
export class Producto {
  id: number;
  nombre: string = '';
  precio: number = 0.0;
  descripcion: string = '';
  imagen: string = '';
  categoria: Categoria = undefined;
  estado: boolean;
  especial: boolean;
}
