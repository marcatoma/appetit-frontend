import { Component, Input, OnInit } from '@angular/core';

// ngbootstrap
// constante
import { BASE_URL } from 'src/environments/configurations';
// models
import { Categoria } from '../../../models/productos/categoria';
import { ProductoService } from '../../../services/productos/producto.service';
import { ComboService } from '../../../services/combo/combo.service';
import { Producto } from '../../../models/productos/producto';
import { Combo } from '../../../models/productos/combo';

@Component({
  selector: 'app-categorias-cliente',
  templateUrl: './categorias-cliente.component.html',
  styleUrls: ['./categorias-cliente.component.css'],
})
export class CategoriasClienteComponent implements OnInit {
  @Input() categorias: Categoria[] = [];
  @Input() categoriasCombos: Categoria[] = [];
  productosEspeciales: Producto[] = [];
  combosEspeciales: Combo[] = [];
  categoria: Categoria;
  api = BASE_URL;
  constructor(
    private productoService: ProductoService,
    private comboService: ComboService
  ) { }
  ngOnInit(): void {
    this.listaProductosEspeciales();
    this.listaCombosEspeciales();
  }

  listaProductosEspeciales = (): void => {
    this.productoService.ObtenerProductosEspecialesClientes().subscribe(response => {
      this.productosEspeciales = response;
    });
  }
  listaCombosEspeciales = (): void => {
    this.comboService.ObtenerCombosEspecialesClientes().subscribe(response => {
      this.combosEspeciales = response;
    });
  }
}
