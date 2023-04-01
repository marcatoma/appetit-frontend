import { Component, OnInit } from '@angular/core';
// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// constantes
import { BASE_URL } from 'src/environments/configurations';
// modelos
import { Combo } from '../../../models/productos/combo';
// servicios
import { ComboService } from 'src/app/services/combo/combo.service';

@Component({
  selector: 'app-lista-combos',
  templateUrl: './lista-combos.component.html',
  styleUrls: ['./lista-combos.component.css'],
})
export class ListaCombosComponent implements OnInit {
  itemsCombos: Combo[] = [];
  api: any = BASE_URL;
  combo: Combo;
  private modalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private comboService: ComboService
  ) { }

  ngOnInit(): void {
    this.listarCombosPageable();
  }

  listarCombosPageable(): void {
    this.comboService.listarCombosPageable(0).subscribe((res) => {
      console.log(res.combos.content);
      this.itemsCombos = res.combos.content;
    });
  }

  // combos items
  productosCombo(combo: Combo, modalPedido): void {
    console.log(combo);
    this.combo = combo;
    this.cerrarModal();
    this.modalRef = this.modalService.open(modalPedido, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });
  }

  abrirModalAcciones(combo: Combo, modalAcciones): void {
    this.combo = combo;
    this.modalRef = this.modalService.open(modalAcciones, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });
  }

  cambiarestado(combo): void {
    console.log(combo.estado);
    this.comboService.CambiarEstadoCombo(combo).subscribe((res) => {
    }, error => {
      this.listarCombosPageable();
    });
  }

  cambiarEstadoEspecial(combo): void {
    console.log(combo.estado);
    this.comboService.CambiarEstadoEspecialCombo(combo).subscribe((res) => {
    }, error => {
      this.listarCombosPageable();
    });
  }


  cerrarModal(): void {
    this.modalRef.close();
  }
}
