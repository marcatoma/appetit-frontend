import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// constantes
import { API_QR } from 'src/environments/configurations';
// modelos
import { Mesa } from 'src/app/models/mesa/mesa';
// servicios
import { MesaService } from 'src/app/services/mesa/mesa.service';
import { MensajesAlertaService } from '../../../services/mensajes-alerta.service';
@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css'],
})
export class MesasComponent implements OnInit {
  mesa: Mesa = new Mesa();
  // datos para componete paginador
  api: string = API_QR;
  // qr data
  QR_DATA: string = '';
  paginador: any;
  path: any = '/dashboard/mesas/page';
  // termina paginacion
  listaMesas: Mesa[] = [];
  chec: boolean = true;
  modalReference: NgbModalRef;
  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private mesasService: MesaService,
    private mensajeService: MensajesAlertaService
  ) {}

  ngOnInit(): void {
    this.listarMesasPageable();
  }

  // listar mesas paginador
  listarMesasPageable(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.mesasService.ObtenerMesasPageable(page).subscribe((mesas: any) => {
        this.listaMesas = mesas.content;
        console.log(this.listaMesas);
        this.paginador = mesas;
      });
    });
  }

  saveMesa(): void {
    if (this.camposLlenos()) {
      this.mesasService.registrarMesa(this.mesa).subscribe((res) => {
        this.listarMesasPageable();
        // alerta de mensaje al guardar el
        this.mensajeService.mensajeSweetInformacion('success', res.mensaje, 'top-end');
        // termina alerta
        this.modalReference.close();
      });
    }
  }

  updateMesa(): void {
    if (this.camposLlenos()) {
      this.mesasService.actualizarMesa(this.mesa).subscribe((res) => {
        this.listarMesasPageable();
        // alerta de mensaje al actualizar el
        this.mensajeService.mensajeSweetInformacion('success', res.mensaje, 'top-end');
        // termina alerta
        this.modalReference.close();
      });
    }
  }

  deletMesa(id: number): void {
    this.mensajeService
          .confirmDialogSweet(
            'warning',
            '¿Eliminar mesa...?',
            'Sí elimina esta mesa es posible que pierda recibos relacionadas con la misma',
            'Si, no hay problema'
          )
          .then((result) => {
            if (result.isConfirmed) {
              this.mesasService.deleteMesa(id).subscribe((res) => {
                this.listarMesasPageable();
                this.mensajeService.mensajeSweetInformacion('success', res, 'top-end');
              });
            }
          });
  }

  openLg(modalMesa: any) {
    this.mesa = new Mesa();
    this.modalReference = this.modalService.open(modalMesa);
  }
  abrirModalMesaQR(modal, mesa: Mesa): void {
    this.QR_DATA = this.api + 'cliente/home/mesa/' + mesa.id;
    this.modalReference = this.modalService.open(modal);
  }
  // abrimos modal con los datos de esa categoria
  ModalActualizarMesa(modalMesa, mesa) {
    if (mesa) {
      this.openLg(modalMesa);
      // cargamos los datos
      this.mesa = mesa;
    }
  }

  camposLlenos(): boolean {
    let band = false;
    if (this.mesa.nombre.length < 3) {
      return band;
    } else {
      return (band = true);
    }
  }
}
