import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

// modelos
import { Caja } from 'src/app/models/caja/caja';
// servicios
import { CajaService } from 'src/app/services/caja/caja.service';
@Component({
  selector: 'app-crear-caja',
  templateUrl: './crear-caja.component.html',
  styleUrls: ['./crear-caja.component.css'],
})
export class CrearCajaComponent implements OnInit {
  public modalRef: NgbModalRef;
  model: NgbDateStruct;
  // paginacion
  paginador: any;
  path: any = '/dashboard/crearcaja/page';
  // termina paginacion
  caja: Caja = new Caja();
  errores: string[] = [];
  cajas: Caja[] = [];
  constructor(
    private modalService: NgbModal,
    private cajaService: CajaService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listarCajasPaginado();
  }

  listarCajasPaginado(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.cajaService.obtenerCajasPage(page).subscribe((res) => {
        console.log(res);
        this.paginador = res;
        this.cajas = res.content;
      });
    });
  }

  registrarCaja(): void {
    //eliminar espacios
    this.caja.numeroCaja = this.caja.numeroCaja.replace(/ /g, '');
    console.log(this.caja);

    this.cajaService.registrarCaja(this.caja).subscribe(
      (res) => {
        this.listarCajasPaginado();
        swal.fire({
          position: 'top-end',
          icon: 'success',
          title: res.mensaje,
          showConfirmButton: false,
          timer: 1000,
        });
        this.errores = [];
        this.cerrarModal();
      },
      (err) => {
        if (err.status === 409) {
          this.errores = err.error.errores as string[];
        }

        swal.fire(err.error.mensaje, err.error.error, 'warning');
      }
    );
  }
  //eliminar caja logicamente
  eliminarCaja(caja: Caja): void {
    if (caja) {
      swal
        .fire({
          title: '¿Está seguro?',
          text: 'Se eliminará la caja de su registro.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, borrar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.cajaService.eliminarCaja(caja.id).subscribe((res) => {
              this.listarCajasPaginado();
              swal.fire({
                position: 'top-end',
                icon: 'success',
                title: res.mensaje,
                showConfirmButton: false,
                timer: 1000,
              });
            });
          }
        });
    }
  }
  //--------------------congiguracion de modales---------------------------------
  abrirModalCaja(modalCaja, caja): void {
    this.caja = new Caja();
    if (caja) {
      this.caja = caja;
    }

    this.modalRef = this.modalService.open(modalCaja, {
      centered: true,
    });
  }
  cerrarModal(): void {
    this.modalRef.close();
  }
}
