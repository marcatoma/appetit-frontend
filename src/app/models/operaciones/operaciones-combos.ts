import { DetalleComboPedido } from '../pedidos/detalle-combo-pedido';

export class OperacionesCombos {
  existeCombo(id: number, items: DetalleComboPedido[]): boolean {
    console.log(items);
    let band = false;
    items.forEach((item: DetalleComboPedido) => {
      if (id === item.combo.id) {
        band = true;
      }
    });
    console.log('clase');

    console.log(items);

    return band;
  }

  incrementarCantidad(
    id: number,
    cantidad: number,
    items: DetalleComboPedido[]
  ): DetalleComboPedido[] {
    items = items.map((item: DetalleComboPedido) => {
      if (id === item.combo.id) {
        item.cantidad += cantidad;
        if (item.combo.infoExtra) {
          item.infoExtra = item.combo.infoExtra;
        }
      }
      return item;
    });
    return items;
  }

  eliminarCombo(id: number, items: DetalleComboPedido[]): DetalleComboPedido[] {
    items = items.filter((item: DetalleComboPedido) => id !== item.combo.id);
    return items;
  }
}
