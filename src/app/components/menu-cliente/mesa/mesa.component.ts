import { Component, OnInit } from '@angular/core';
// modelos
import { Mesa } from '../../../models/mesa/mesa';
// servicios
import { MesaService } from '../../../services/mesa/mesa.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.css'],
})
export class ClienteMesaComponent implements OnInit {
  mesas: Mesa[] = [];
  constructor(private mesaService: MesaService) {}

  ngOnInit(): void {
    this.mesaService.ObtenerMesas().subscribe((mesas) => {
      this.mesas = mesas;
    });
  }
}
