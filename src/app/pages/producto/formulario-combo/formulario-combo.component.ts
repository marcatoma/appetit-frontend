import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

// constantes
import { API_PROD, BASE_URL } from '../../../../environments/configurations';
// Modelos
import { Categoria } from 'src/app/models/productos/categoria';
import { Combo } from 'src/app/models/productos/combo';
import { Producto } from '../../../models/productos/producto';
import { ProductoCombo } from 'src/app/models/productos/producto-combo';
// servicios
import { CategoriaService } from 'src/app/services/categoria/categoria.service';
import { ComboService } from 'src/app/services/combo/combo.service';
import { ProductoService } from '../../../services/productos/producto.service';
// componentes
import { PreviewImgComponent } from '../../../components/preview-img/preview-img.component';
import { NgModel } from '@angular/forms';
import { MensajesAlertaService } from '../../../services/mensajes-alerta.service';
@Component({
  selector: 'app-formulario-combo',
  templateUrl: './formulario-combo.component.html',
  styleUrls: ['./formulario-combo.component.css'],
})
export class FormularioComboComponent implements OnInit {
  @ViewChild('img_url', { static: false }) img_url: PreviewImgComponent;
  imagenProducto: File;
  listaCategorias: Categoria[] = [];
  combo: Combo = new Combo();
  api: any = BASE_URL;
  constructor(
    private productoService: ProductoService,
    private comboService: ComboService,
    private categoriaService: CategoriaService,
    private mensajesService: MensajesAlertaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.listarCategoriasCombo();
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = +params.get('id');
      if (id) {
        this.buscarCombo(id);
      }
    });
  }

  onChange(event): void {
    this.imagenProducto = event.target.files[0];
    if (this.imagenProducto && this.imagenProducto.type.indexOf('image') < 0) {
      this.imagenProducto = null;
      this.mensajesService.mensajeSweetFire('error', 'Solo imágenes', 'Error');
    }
  }

  // listar categorias para el combo
  listarCategoriasCombo(): void {
    this.comboService.listarCategoriasCombo().subscribe((res) => {
      console.log(res.categorias);
      this.listaCategorias = res.categorias;
    });
  }

  // registrar combo
  registrarCombo(): void {
    if (this.camposLlenos()) {
      if (this.imagenProducto) {
        this.comboService.registrarCombo(this.combo).subscribe((res) => {
          console.log(res);
          this.cargarImagenProducto(res.id_combo);
        });
      } else {
        this.mensajesService.mensajeSweetFire('warning', 'Debe seleccionar una imágen.', 'Observación');
      }
    }
  }

  // actualizar combos
  actualizarCombo(): void {
    if (this.camposLlenos()) {
      if (this.imagenProducto) {
        this.comboService.registrarCombo(this.combo).subscribe((res) => {
          this.cargarImagenProducto(res.id_combo);
          this.router.navigate(['/dashboard/combos/page/0']);
        }, (error) => {
            console.log(error.mensaje);
          });
      } else {
        if (this.combo.imagen == '') {
          this.mensajesService.mensajeSweetFire('warning', 'Debe seleccionar una imágen.', 'Advertencia');
        } else {
          this.comboService.registrarCombo(this.combo).subscribe((res) => {
            console.log('Producto actualizado');
            this.mensajesService.mensajeSweetFireToast('success', 'Su producto fué actualizado correctamente.', 'top-end');
            console.log(res);
            this.router.navigate(['/dashboard/combos/page/0']);
          }),
            (error) => {
              console.log(error.mensaje);
            };
        }
      }
    }
  }

  // campos completos
  camposLlenos(): boolean {
    let band = false;
    let c = this.combo;
    if (
      c.itemsCombo.length === 0 ||
      c.precio === 0 ||
      !c.categoria ||
      c.nombre.length < 3
    ) {
      this.mensajesService.mensajeSweetFire('warning', 'Completar los campos', 'Observación');
    } else {
      band = true;
    }
    return band;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      mergeMap((term) =>
        term ? this.productoService.getProductoByTerm(term) : []
      )
    );
  // para mostrar datos en la lista del input
  formatter = (producto: Producto) =>
    producto.nombre +
    ' -> $' +
    producto.precio +
    ' -> ' +
    producto.categoria.nombre;
  data: Producto[] = [];
  // para cuando se seleciona un item
  seleccionarProducto = (producto: Producto) => {
    let itemscombo: ProductoCombo = new ProductoCombo();
    itemscombo.producto = producto;
    // verificar si existe sino hacer un nuevo push
    if (!this.existeProducto(producto.id)) {
      this.combo.itemsCombo.push(itemscombo);
    } else {
      // si existe solo suma la cantidad
      this.combo.itemsCombo = this.combo.itemsCombo.map(
        (item: ProductoCombo) => {
          if (item.producto.id == producto.id) {
            item.cantidad++;
          }
          return item;
        }
      );
    }
    return '';
  };

  existeProducto(id: number): boolean {
    let band = false;
    this.combo.itemsCombo.forEach((item: ProductoCombo) => {
      if (item.producto.id === id) {
        band = true;
      }
    });
    return band;
  }

  eliminarProductoArray(id: number): void {
    this.combo.itemsCombo = this.combo.itemsCombo.filter(
      (item: ProductoCombo) => id !== item.producto.id
    );
  }

  actualizarCantidad$(id: number, event: any): void {
    let cantidad: number = event.target.value as number;
    if (cantidad <= 0) {
      return this.eliminarProductoArray(id);
    }

    this.combo.itemsCombo = this.combo.itemsCombo.map((item: ProductoCombo) => {
      if (item.producto.id === id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  cargarImagenProducto(id: number): void {
    this.categoriaService
      .saveImgCategoria_Producto(this.imagenProducto, id, API_PROD, 'combo')
      .subscribe(
        (res) => {
          this.mensajesService.mensajeSweetFireToast('success', 'Producto guardado correctamente.', 'top-end', 1000);
          console.log('guardado');
          this.imagenProducto = null;
          this.combo = new Combo();
          this.img_url.vaciarUrl();
        },
        (error) => {
          this.productoService
            .deleteProductoDefinitive(id)
            .subscribe((res) => { });
          console.log('error');
          console.log(error);
          this.imagenProducto = null;
        }
      );
  }

  compararCategoria(o1: Categoria, o2: Categoria): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }

  buscarCombo(id: number): void {
    this.comboService.obtenerComboId(id).subscribe((res) => {
      this.combo = res.combo;
      this.img_url.pasarURLImg('product/img/' + this.combo.imagen);
    },
      (err) => {
        console.log(err);
      });
  }

  errorPrecio(precioInput: NgModel): boolean {
    console.log();
    let precio = precioInput.control.value;
    if(!precio || precio<0){
      return true;
    }
    return false;
  }
}
