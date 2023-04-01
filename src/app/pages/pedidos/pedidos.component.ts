import { Component, OnDestroy, OnInit } from '@angular/core';
// ngboostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// Modelos
import { Mesa } from 'src/app/models/mesa/mesa';
import { Pedido } from 'src/app/models/pedidos/pedido';
// servicios
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
})
export class PedidosComponent implements OnInit, OnDestroy {
  private modalRef: NgbModalRef;

  mesasPedidos: Mesa[] = [];
  nombreMesa: string;
  pedidosPorMesa: Pedido[] = [];
  cantidadPedido = 0;
  listaPedidos: Pedido[] = [];
  constructor(
    private modalService: NgbModal,
    private pedidoService: PedidoService
  ) {}
  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
  ngOnInit(): void {
    this.listarPedidosDelDia();
  }

  // listar pedidos del dia
  listarPedidosDelDia(): void {
    this.pedidoService
      .listarPedidosExepEntregadosAnulados()
      .subscribe((pedidos) => {
        this.listaPedidos = pedidos;
        console.log(pedidos);

        this.filtrarPorMesas();
      });
  }

  // filtramos por mesa para separar los pedidos en la vista del cliente
  filtrarPorMesas(): void {
    let nombreMesa = [];
    this.listaPedidos.forEach((pedido: Pedido) => {
      if (!nombreMesa.includes(pedido.mesa.id)) {
        this.mesasPedidos.push(pedido.mesa);
        nombreMesa.push(pedido.mesa.id);
      }
    });
  }

  // filtramos los pedidos por mesa para el modal
  filtrarPedidosPorMesa(mesa, modalPedido): void {
    this.nombreMesa = mesa;
    this.pedidosPorMesa = this.listaPedidos.filter(
      (pedido: Pedido) => pedido.mesa.nombre === mesa
    );
    this.modalRef = this.modalService.open(modalPedido, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });
  }
  // Para hacer un badge con la cantidad de pedidos
  numeroPedidos(idMesa: number): number {
    this.cantidadPedido = 0;
    for (const pedido of this.listaPedidos) {
      if (pedido.mesa.id === idMesa) {
        this.cantidadPedido++;
      }
    }
    return this.cantidadPedido;
  }
}
