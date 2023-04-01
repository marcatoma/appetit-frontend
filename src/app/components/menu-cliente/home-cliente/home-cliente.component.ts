import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// modelos
import { Categoria } from '../../../models/productos/categoria';
// servicios
import { CategoriaService } from 'src/app/services/categoria/categoria.service';
import { ComboService } from '../../../services/combo/combo.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css'],
})
export class HomeClienteComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriasCombo: Categoria[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService,
    private pedidoService: PedidoService,
    private comboService: ComboService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let id_mesa = +params.get('id_mesa');
      console.log(id_mesa);
      if (id_mesa) {
        this.router.navigate(['/cliente/home/mesa/', id_mesa]);
        this.pedidoService.id_mesa$.emit(id_mesa);
        this.guardarIdMesaLocalStorage(id_mesa);
      } else {
        this.router.navigate(['/cliente/mesas']);
      }
    });

    this.listarCategorias();
    this.listarCategoriasCombos();
  }

  listarCategorias(): void {
    this.categoriaService.ListaCategoriasProductos().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }
  listarCategoriasCombos(): void {
    this.comboService.listarCategoriasCombo().subscribe((categoriasCombo) => {
      this.categoriasCombo = categoriasCombo.categorias;
    });
  }

  guardarIdMesaLocalStorage(id_mesa): void {
    const now = new Date();
    const item = {
      value: id_mesa,
      expiry: now.getTime() + 1800000,
    };
    localStorage.setItem('id_mesa', JSON.stringify(item));
  }
}
