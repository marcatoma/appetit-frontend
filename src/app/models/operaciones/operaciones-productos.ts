import { DetallePedido } from '../pedidos/detalle-pedido';

export class OperacionesProductos {
  existeProducto(id: number, items: DetallePedido[]): boolean {
    console.log(items);
    let band = false;
    items.forEach((item: DetallePedido) => {
      if (id === item.producto.id) {
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
    items: DetallePedido[]
  ): DetallePedido[] {
    items = items.map((item: DetallePedido) => {
      if (id === item.producto.id) {
        item.cantidad += cantidad;
      }
      return item;
    });
    return items;
  }

  eliminarProducto(id: number, items: DetallePedido[]): DetallePedido[] {
    items = items.filter((item: DetallePedido) => id !== item.producto.id);
    return items;
  }
}
