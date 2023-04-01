import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
// modelos
import { Movimiento } from 'src/app/models/caja/movimiento';
import { Pedido } from 'src/app/models/pedidos/pedido';
import { Usuario } from 'src/app/models/persona/usuario.model';
// servicios
import { AuthService } from 'src/app/services/auth/auth.service';
import { MovimientoService } from 'src/app/services/caja/movimiento.service';
//swalservice
import swal from 'sweetalert2';
@Component({
  selector: 'app-listar-movimientos-caja',
  templateUrl: './listar-movimientos-caja.component.html',
  styleUrls: ['./listar-movimientos-caja.component.css'],
})
export class ListarMovimientosCajaComponent implements OnInit {
  public modalRef: NgbModalRef;
  fechaInicio: NgbDateStruct;
  fechaFin: NgbDateStruct;
  //************************paginacion******************** */
  paginador: any;
  path: string = '/dashboard/movimientos/page';
  //*************************termina paginacion********** */
  movimientos: Movimiento[] = [];
  page: number;
  pedido: Pedido = new Pedido();
  constructor(
    private modalService: NgbModal,
    private movimientoService: MovimientoService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(this.fechaInicio);
    this.obtenerMovimientos();
  }

  obtenerMovimientos() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.page = +params.get('page');
      if (!this.page) {
        this.page = 0;
      }
    });
    let user: Usuario = this.authService.usuario;
    if (user.id) {
      let IsAdmin: boolean = this.authService.hasRole('ROLE_ADMIN');
      //cambiar aqui
      if (IsAdmin) {
        this.obtenerMovimientosFechaAdmin(new Date(), new Date(), this.page);
      } else {
        this.obtenerMovimientosUsuario(user.id, this.page);
      }
    }
  }

  buscarMovimientosPorFechas(): void {
    if (this.fechaInicio && this.fechaFin) {
      let fI = this.fechaInicio;
      let fechaIni: Date = new Date(fI.year, fI.month - 1, fI.day);
      let fF = this.fechaFin;
      let fechaFin: Date = new Date(fF.year, fF.month - 1, fF.day);
      this.obtenerMovimientosFechaAdmin(fechaIni, fechaFin, this.page);
    } else {
      swal.fire(
        'Observación',
        'Seleccionar ambas fechas para la busqueda.',
        'warning'
      );
    }
  }

  obtenerMovimientosFechaAdmin(desde: Date, hasta: Date, page: number): void {
    this.movimientoService
      .obtenerMovimientosFecha(desde, hasta, page)
      .subscribe((res) => {
        console.log(res);
        this.movimientos = res.content;
      });
  }

  obtenerMovimientosUsuario(user_id: number, page: number): void {
    this.movimientoService
      .obtenerMovimientosUsuario(user_id, page)
      .subscribe((res) => {
        this.movimientos = res.content;
        this.paginador = res;
      });
  }

  abrirDetalle(pedido: Pedido, modalDetalle): void {
    if (pedido) {
      this.pedido = pedido;
      this.modalRef = this.modalService.open(modalDetalle, {
        centered: true,
        size: 'xl',
      });
    }
  }
  cerrarModal(): void {
    this.modalRef.close();
  }
}
