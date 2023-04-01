import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
// constantes
import { BASE_URL } from 'src/environments/configurations';
// modelos
import { Producto } from '../../models/productos/producto';
// servicios
import { ProductoService } from 'src/app/services/productos/producto.service';
import { MensajesAlertaService } from '../../services/mensajes-alerta.service';

@Component({
  selector: 'app-producto-listar',
  templateUrl: './producto-listar.component.html',
  styleUrls: ['./producto-listar.component.css'],
})
export class ProductoListarComponent implements OnInit {
  listaProductos: Producto[] = [];
  // variable contenedor de los datos de la paginacion de productos
  paginador: any;
  path: any = '/dashboard/productos/page';
  producto: Producto = new Producto();
  api: any = BASE_URL;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productoserService: ProductoService,
    private mensajesService: MensajesAlertaService
  ) { }

  ngOnInit(): void {
    this.listarProductospage();
  }

  listarProductospage(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.productoserService
        .ObtenerProductosPageable(page)
        .subscribe((res) => {
          this.listaProductos = res.content;
          this.paginador = res;
        });
    });
  }
  eliminarProducto(id: number): void {
    this.mensajesService
          .confirmDialogSweet('warning', 
                              '¿Desea eliminar..?',
                              'Sí ud elimina este producto es posible que pierda recibos relacionadas con este producto.', 
                              'Si, Eliminar de todas formas'
                            ).then((result) => {
                              if (result.isConfirmed) {
                                this.productoserService.deleteProducto(id).subscribe((res) => {
                                  this.listarProductospage();
                                  this.mensajesService.mensajeSweetInformacion('success', res, 'top-end');
                                });
                              }
                            });
  }

  // funcion para cambiar el estado del producto
  cambiarEstadoProducto(prod: Producto): void {
    this.productoserService.CambiarEstadoProducto(prod)
      .subscribe((res) => {
        console.log(res);
      }, error => {
        this.listarProductospage();
      });
  }

  // funcion para cambiar el estado del producto
  cambiarEstadoEspecialProducto(prod: Producto): void {
    this.productoserService.CambiarEstadoProducto(prod)
      .subscribe((res) => {
        console.log(res);
      }, error => {
        this.listarProductospage();
      });
  }
}
