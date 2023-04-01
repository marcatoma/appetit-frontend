import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
// ngboostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
// modelos
import { Arqueo } from 'src/app/models/caja/arqueo';
// servicios
import { ArqueoService } from 'src/app/services/caja/arqueo.service';

@Component({
  selector: 'app-listar-arqueos',
  templateUrl: './listar-arqueos.component.html',
  styleUrls: ['./listar-arqueos.component.css'],
})
export class ListarArqueosComponent implements OnInit {
  public modalRef: NgbModalRef;
  fechaInico: NgbDateStruct;
  fechaFin: NgbDateStruct;
  //paginacion
  paginador: any;
  path: any = '/dashboard/arqueos/page';
  //termina paginacion
  //fechas de peticion de arqueos
  desde: Date = new Date();
  hasta: Date = new Date();
  arqueoModal: Arqueo = new Arqueo();
  arqueos: Arqueo[] = [];
  constructor(
    private modalService: NgbModal,
    private arqueoService: ArqueoService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listarArqueos(this.desde, this.hasta);
  }
  //************************************************ */
  //--------------------funciones---------------------
  //************************************************ */

  listarArqueos(desde: Date, hasta: Date): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.arqueoService
        .obtenerArqueosFecha(page, desde, hasta)
        .subscribe((res) => {
          this.arqueos = res.content;
          this.paginador = res;
        });
    });
  }

  changeFechas(): void {
    if (this.fechaInico && this.fechaFin) {
      let fI = this.fechaInico;
      let fechaIni: Date = new Date(fI.year, fI.month - 1, fI.day);

      let fF = this.fechaFin;
      let fechaFin: Date = new Date(fF.year, fF.month - 1, fF.day);

      this.listarArqueos(fechaIni, fechaFin);
    } else {
      swal.fire(
        'Observación',
        'Seleccionar ambas fechas para la busqueda.',
        'warning'
      );
    }
  }

  //cerrar el arqueo
  cerrarArqueoCaja(arqueo: Arqueo): void {
    swal
      .fire({
        title: '¿Está seguro de cerrar la caja?',
        text: 'No se podrá abrir nuevamente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.arqueoService.cerrarArqueo(arqueo).subscribe((res) => {
            this.listarArqueos(this.desde, this.hasta);
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res,
              showConfirmButton: false,
              timer: 1000,
            });
          });
        }
      });
  }

  //************************************************ */
  //--------------------modales-----------------------
  //************************************************ */
  abrirModalDetalleArqueo(modalDetallerArqueo, arqueo: Arqueo): void {
    this.arqueoModal = arqueo;
    this.modalRef = this.modalService.open(modalDetallerArqueo, {
      centered: true,
      size: 'xl',
    });
  }
  cerrarModal(): void {
    this.arqueoModal = new Arqueo();
    this.modalRef.close();
  }
}
