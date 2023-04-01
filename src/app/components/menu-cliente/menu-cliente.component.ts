import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// modelos
import { Categoria } from '../../models/productos/categoria';
// servicios
import { CategoriaService } from '../../services/categoria/categoria.service';
import { ComboService } from 'src/app/services/combo/combo.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-menu-cliente',
  templateUrl: './menu-cliente.component.html',
  styleUrls: ['./menu-cliente.component.css'],
})
export class MenuClienteComponent implements OnInit {
  categorias: Categoria[] = [];
  mesa_id: number;
  categoriascombos: Categoria[] = [];
  constructor(
    private router: Router,
    private categoriaService: CategoriaService,
    private pedidoService: PedidoService,
    private comboService: ComboService
  ) {}

  ngOnInit(): void {
    let id_mes_local = this.recuperarDelLocalStorage();

    //obtener el id de la mesa
    this.pedidoService.id_mesa$.subscribe((id_mesa) => {
      //solucion errore de cambio de vartiable
      setTimeout(() => {
        this.mesa_id = id_mesa;
      }, 0);
      if (!id_mesa) {
        if (id_mes_local) {
          console.log(id_mes_local);
          this.router.navigate(['/cliente/home/mesa/', id_mes_local]);
        } else {
          this.router.navigate(['/cliente/mesas']);
        }
      } else {
        this.categoriaService
          .ListaCategoriasProductos()
          .subscribe((categorias) => {
            this.categorias = categorias;
          });
        this.comboService.listarCategoriasCombo().subscribe((categorias) => {
          console.log(categorias);

          this.categoriascombos = categorias.categorias;
        });
      }
    });
  }

  recuperarDelLocalStorage(): number {
    let valor = localStorage.getItem('id_mesa');
    let id: number;
    if (valor) {
      const item = JSON.parse(valor);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem('id_mesa');
      } else {
        let val = item.value;
        if (val != null) {
          id = val;
        }
      }
    }
    return id;
  }
}
