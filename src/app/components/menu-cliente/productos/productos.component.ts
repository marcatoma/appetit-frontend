import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// constantes
import { BASE_URL } from 'src/environments/configurations';
// modelos
import { Combo } from 'src/app/models/productos/combo';
import { DetallePedido } from 'src/app/models/pedidos/detalle-pedido';
import { OperacionesProductos } from 'src/app/models/operaciones/operaciones-productos';
import { Pedido } from 'src/app/models/pedidos/pedido';
import { Producto } from '../../../models/productos/producto';
// servicios
import { ComboService } from 'src/app/services/combo/combo.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ProductoService } from 'src/app/services/productos/producto.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  private modalRef: NgbModalRef;
  api = BASE_URL;
  // variables
  notificacion: any;
  // Instancia objetos
  item: DetallePedido = new DetallePedido();
  items: DetallePedido[] = [];
  producto: Producto = new Producto();
  pedido_local: Pedido = new Pedido();
  productos: Producto[] = [];
  combos: Combo[] = [];
  operacion: OperacionesProductos = new OperacionesProductos();
  titulo: string = '';
  constructor(
    private modalService: NgbModal,
    private productoService: ProductoService,
    private pedidosService: PedidoService,
    private activatedRoute: ActivatedRoute,
    private comboService: ComboService
  ) {
    // inicalizamos variable para notificaciones
    // @ts-ignore
    this.notificacion = Metro.notify;
  }

  ngOnInit(): void {
    // para regresar items si hay cambios en el navarcomponent
    this.pedidosService.items$.subscribe((items) => {
      this.items = items;
    });
    //listar items del local storage si existten
    this.recuperarDelLocalStorage();
    //parametros de id de categoria
    this.activatedRoute.paramMap.subscribe((params) => {
      let id_cate = +params.get('id_cate');
      const productoEspecial = params.get('id_cate');
      if (id_cate) {
        this.titulo = '';
        this.listarProductosPorCategoria(id_cate);
      } else if (productoEspecial) {
        this.titulo = 'Productos especiales';
        this.listarProductosEspeciales();
      }
    });
  }

  //listar productos por categoria
  listarProductosPorCategoria(id: number): void {
    this.productoService.ObtenerProductosClientes(id).subscribe((res) => {
      this.productos = res;
    });
  }
  //listar productos por categoria
  listarProductosEspeciales(): void {
    this.productoService.ObtenerProductosEspecialesClientes().subscribe((res) => {
      this.productos = res;
    });
  }

  listarCombosPorCategoria(id: number): void {
    this.comboService.ObtenerCombosClientes(0).subscribe((response) => {
      this.combos = response.combos;
      console.log(this.combos);
    });
  }

  // agregar un producto al pedido
  agregarProducto(prod: Producto): void {
    if (this.existeProducto(prod.id)) {
      this.incrementarCantidad(prod.id);
      this.notificaciones('se actualizó la cantidad del producto');
    } else {
      //agregamos el produxto al item
      this.item.producto = prod;
      this.items.push(this.item);
      this.notificaciones('se agregó un producto');
      // aqui debe estar este medodo par que funcione
      this.pedidosService.items$.emit(this.items);
    }
    //cerrar modal y restaurar valor del item
    this.cerrarModalDetalle();
  }
  productoModal(producto: Producto, modal): void {
    this.producto = producto;
    this.modalRef = this.modalService.open(modal, { centered: true });
  }
  sumarCantidad(): void {
    this.item.cantidad++;
  }

  restarCantidad(): void {
    if (this.item.cantidad > 1) {
      this.item.cantidad--;
    }
  }

  notificaciones(mensaje: string): void {
    this.notificacion.setup({
      width: 300,
      timeout: 1000,
      animation: 'easeOutBounce',
    });
    this.notificacion.create(mensaje, '', { cls: 'success' });
  }

  //cerrar modal de detalle
  cerrarModalDetalle(): void {
    this.item = new DetallePedido();
    this.modalRef.close();
  }

  // verificar si un producto existe en el pedido
  existeProducto(id: number): boolean {
    let band = this.operacion.existeProducto(id, this.items);
    return band;
  }

  // si existe un producto duplicado aumentar la cantidad
  incrementarCantidad(id: number): void {
    this.items = this.operacion.incrementarCantidad(
      id,
      this.item.cantidad,
      this.items
    );
    //actualizar cantidad en el navbar
    this.pedidosService.items$.emit(this.items);
  }

  //eliminar un producto de la lista del pedido
  eliminarProducto(id: number): void {
    this.items = this.operacion.eliminarProducto(id, this.items);
  }

  // recuperar pedid del local storage
  recuperarDelLocalStorage(): void {
    let pedido_local = localStorage.getItem('pedido');
    if (pedido_local) {
      const item = JSON.parse(pedido_local);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem('pedido');
      } else {
        this.pedido_local = item.value;
        if (this.pedido_local != null) {
          this.items = this.pedido_local.items;
        }
      }
    }
  }
}
