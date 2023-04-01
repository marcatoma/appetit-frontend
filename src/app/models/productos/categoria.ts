import { TipoCategoria } from './tipo-categoria';

export class Categoria {
  id: number;
  nombre: string = '';
  imagen: string = '';
  estado: boolean;
  tipo: TipoCategoria;
}
