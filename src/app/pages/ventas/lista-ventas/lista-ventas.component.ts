import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// ngBoostrap
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Pedido } from 'src/app/models/pedidos/pedido';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
// modelos
// servicios

@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.component.html',
  styleUrls: ['./lista-ventas.component.css'],
})
export class ListaVentasComponent implements OnInit {
  modalRef: NgbModalRef;
  fechaInico: NgbDateStruct;
  fechaFin: NgbDateStruct;
  ventas: Pedido[] = [];
  page: number;
  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    //obtener el parametro page
    this.activatedRoute.paramMap.subscribe((params) => {
      this.page = +params.get('page');
      if (!this.page) {
        this.page = 0;
      }
    });
    this.listarVentas(new Date(), new Date(), this.page);
  }

  listarVentas(fecha_ini: Date, fecha_fin: Date, page: number): void {
    this.pedidoService
      .listarVentas(fecha_ini, fecha_fin, page)
      .subscribe((res) => {
        console.log(res);
        this.ventas = res.content;
      });
  }

  //************************************************MODALES*************************************************/
  abrirModalDetalleCliente(modalDetallerCliente): void {
    this.modalRef = this.modalService.open(modalDetallerCliente, {
      centered: true,
    });
  }
  abrirModalDetallePedido(modalDetallerPedido): void {
    this.modalRef = this.modalService.open(modalDetallerPedido, {
      centered: true,
      size: 'xl',
    });
  }
  cerrarModal(): void {
    this.modalRef.close();
  }
}
