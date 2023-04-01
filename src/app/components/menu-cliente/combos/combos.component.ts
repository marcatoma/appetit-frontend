import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// constantes
import { BASE_URL } from '../../../../environments/configurations';
// modelos
import { Combo } from '../../../models/productos/combo';
import { DetalleComboPedido } from 'src/app/models/pedidos/detalle-combo-pedido';
import { Pedido } from 'src/app/models/pedidos/pedido';
import { Producto } from 'src/app/models/productos/producto';
import { ProductoCombo } from '../../../models/productos/producto-combo';
import { OperacionesCombos } from 'src/app/models/operaciones/operaciones-combos';
// servicios
import { ComboService } from '../../../services/combo/combo.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ProductoService } from 'src/app/services/productos/producto.service';

@Component({
  selector: 'app-combos',
  templateUrl: './combos.component.html',
  styleUrls: ['./combos.component.css'],
})
export class CombosComponent implements OnInit {
  public modalRef: NgbModalRef;
  notificacion: any;
  pedido_local: Pedido = new Pedido();
  bebidas: Producto[] = [];
  combos: Combo[] = [];
  items: DetalleComboPedido[] = [];
  item: DetalleComboPedido = new DetalleComboPedido();
  combo: Combo;
  BebidaCombo: Producto;
  operaciones: OperacionesCombos = new OperacionesCombos();
  api = BASE_URL;
  infoExtra: string = '';

  titulo:string  = '';
  constructor(
    private modalService: NgbModal,
    private activatedRouter: ActivatedRoute,
    private comboService: ComboService,
    private pedidoService: PedidoService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.listarCombos();
    this.recuperarDelLocalStorage();
    // obtener la lista modificada de
    this.pedidoService.itemscombo$.subscribe((items) => {
      this.items = items;
    });
    // obtener la bebidas
    this.obtenerBebidas();
  }

  listarCombos = (): void => {
    this.activatedRouter.paramMap.subscribe((params) => {
      const id_categoria = +params.get('id');
      const comboEspecia = params.get('id');
      if (id_categoria) {
        this.titulo = 'Combos';
        this.comboService
          .ObtenerCombosClientes(id_categoria)
          .subscribe((combosCliente) => {
            console.log(combosCliente);
            this.combos = combosCliente;
          });
      } else if ( comboEspecia ) {
        this.titulo = 'Combos especiales';
        this.comboService.ObtenerCombosEspecialesClientes().subscribe( response => {
          this.combos = response;
        });
      }
    });
  }
  // agregar un producto al pedido
  agregarCombo(comb: Combo): void {
    comb.infoExtra = this.infoExtra;
    //en el caso de ser sin bebidas
    if (!this.combo.saborBebida && this.verificarComboBebidas() == false) {
      this.addCombo(comb);
      this.cerrarModalDetalle();
    } else {
      if (this.combo.saborBebida && this.verificarComboBebidas() == true) {
        this.addCombo(comb);
        this.cerrarModalDetalle();
      } else {
        console.log('escoger un sabor');
      }
    }
    //en el caso de contener bebidas
    // cerrar modal y restaurar valor del item
    console.log(this.items);
  }

  private addCombo(comb: Combo): void {
    if (this.existeCombo(comb.id)) {
      this.combo.infoExtra = this.infoExtra;
      this.incrementarCantidad(comb.id);
      // ARREGLAR LAS NOTIFICACIOINES
      // this.notificaciones('se actualizó la cantidad del producto');
    } else {
      // agregamos el produxto al item
      this.item.combo = comb;
      this.item.infoExtra = this.infoExtra;
      this.items.push(this.item);
      // ARREGLAR LAS NOTIFICACIOINES
      // this.notificaciones('se agregó un producto');
      // aqui debe estar este medodo par que funcione
      this.pedidoService.itemscombo$.emit(this.items);
    }
    this.combo = new Combo();
  }

  // verificar si un producto existe en el pedido
  existeCombo(id: number): boolean {
    let band = this.operaciones.existeCombo(id, this.items);
    return band;
  }

  // si existe un producto duplicado aumentar la cantidad
  incrementarCantidad(id: number): void {
    this.items = this.operaciones.incrementarCantidad(
      id,
      this.item.cantidad,
      this.items
    );
  }

  // eliminar un combo de la lista del pedido
  eliminarCombo(id: number): void {
    this.items = this.operaciones.eliminarCombo(id, this.items);
  }

  modalDetalleCombo(modalDetalle): void {
    this.modalRef = this.modalService.open(modalDetalle, {
      centered: true,
    });
  }
  comboModal(combo: Combo, modal): void {
    this.infoExtra = '';
    this.combo = combo;
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      size: 'xl',
    });
  }
  // para mensajes toast
  notificaciones(mensaje: string): void {
    this.notificacion.setup({
      width: 300,
      timeout: 1000,
      animation: 'easeOutBounce',
    });
    this.notificacion.create(mensaje, '', { cls: 'success' });
  }

  sumarCantidad(): void {
    this.item.cantidad++;
  }

  restarCantidad(): void {
    if (this.item.cantidad > 1) {
      this.item.cantidad--;
    }
  }

  // cerrar modal de detalle
  cerrarModalDetalle(): void {
    this.item = new DetalleComboPedido();
    this.modalRef.close();
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
          this.items = this.pedido_local.combos;
        }
      }
    }
  }

  compararBebidas(o1: Producto, o2: Producto): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }

  obtenerBebidas(): void {
    this.productoService.ObtenerProductosClientes(1).subscribe((result) => {
      this.bebidas = result;
    });
  }

  asignarBebida(): void {
    console.log(this.BebidaCombo.nombre);

    this.combo.saborBebida = this.BebidaCombo.nombre;
    console.log(this.combo.saborBebida);
  }

  verificarComboBebidas(): boolean {
    // devuelve true almenos si hay una bebida asignada en el combo si no falso
    return this.combo.itemsCombo.some(
      (item: ProductoCombo) => item.producto.categoria.id === 1
    );
  }
}
