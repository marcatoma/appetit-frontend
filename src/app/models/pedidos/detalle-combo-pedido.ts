import { Combo } from '../productos/combo';

export class DetalleComboPedido {
  id: number;
  combo: Combo;
  cantidad: number = 1;
  infoExtra: string = '';
}
