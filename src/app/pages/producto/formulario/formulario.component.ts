import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
// constantes
import { API_PROD } from 'src/environments/configurations';
// modelos
import { Categoria } from 'src/app/models/productos/categoria';
import { Producto } from 'src/app/models/productos/producto';
// servicios
import { CategoriaService } from 'src/app/services/categoria/categoria.service';
import { ProductoService } from 'src/app/services/productos/producto.service';
// componentes
import { PreviewImgComponent } from '../../../components/preview-img/preview-img.component';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  @ViewChild('img_url', { static: false }) img_url: PreviewImgComponent;
  imagenProducto: File;
  producto: Producto = new Producto();
  listaCategorias: Categoria[] = [];
  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.ListarCategorias();
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = +params.get('id');
      if (id) {
        this.buscarproducto(id);
      }
    });
  }

  buscarproducto(id: number) {
    swal.showLoading();
    this.productoService.ObtenerProducto(id).subscribe((response) => {
      this.producto = response;
      this.img_url.pasarURLImg('product/img/' + this.producto.imagen);
      swal.close();
    });
  }
  onChange(event): void {
    this.imagenProducto = event.target.files[0];
    if (this.imagenProducto.type.indexOf('image') < 0) {
      this.imagenProducto = null;
      swal.fire('Error', 'Solo imágenes', 'error');
    }
  }

  RegistrarProducto(): void {
    if (this.CamposCompletos()) {
      if (this.imagenProducto) {
        this.productoService
          .RegistarProducto(this.producto)
          .subscribe((response) => {
            this.cargarImagenProducto(response.id);
          });
      } else {
        swal.fire('Observación', 'Debe seleccionar una imágen.', 'warning');
      }
    } else {
      swal.fire('Observación', 'Debe llenar los campos.', 'warning');
    }
  }
  //metodo para actualizar un producto
  actualizaProducto(): void {
    //validamos campos
    if (this.CamposCompletos()) {
      if (this.imagenProducto) {
        this.productoService.updateProduct(this.producto).subscribe((res) => {
          let id = res.id_producto;
          console.log(res);
          this.cargarImagenProducto(id);
          this.route.navigate(['/dashboard/productos/page/0']);
        }),
          (error) => {
            console.log(error.mensaje);
          };
      } else {
        if (this.producto.imagen == '') {
          //si no existe un nombre de imagen no se puede actualizar.
          swal.fire('Advertencia', 'Debe seleccionar su imagen', 'warning');
        } else {
          this.productoService.updateProduct(this.producto).subscribe(
            (response) => {
              console.log('Producto actualizado');
              swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Su producto fué actualizado correctamente.',
                showConfirmButton: false,
                timer: 1000,
              });
              console.log(response);
              this.route.navigate(['/dashboard/productos/page/0']);
            },
            (error) => {
              console.log(error.mensaje);
            }
          );
        }
      }
    } else {
      swal.fire('Observación', 'Debe llenar los campos.', 'warning');
    }
  }
  //temina metodo de actualizaProducto
  cargarImagenProducto(id: number): void {
    this.categoriaService
      .saveImgCategoria_Producto(this.imagenProducto, id, API_PROD, 'producto')
      .subscribe(
        (res) => {
          swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Producto guardado correctamente',
            showConfirmButton: false,
            timer: 1000,
          });
          console.log('guardado');
          this.imagenProducto = null;
          this.producto = new Producto();
          this.img_url.vaciarUrl();
        },
        (error) => {
          this.productoService
            .deleteProductoDefinitive(id)
            .subscribe((res) => {});
          console.log('error');
          console.log(error);
          this.imagenProducto = null;
        }
      );
  }

  ListarCategorias(): void {
    this.categoriaService.ListaCategoriasProductos().subscribe((response) => {
      this.listaCategorias = response;
    });
  }

  //comparar-validar datos de categorias en boostrap
  compararCategoria(o1: Categoria, o2: Categoria): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }

  CamposCompletos(): boolean {
    let band = false;
    if (
      this.producto.categoria != undefined &&
      this.producto.descripcion.length > 2 &&
      this.producto.nombre.length > 2 &&
      this.producto.precio > 0
    ) {
      band = true;
    }
    return band;
  }

  // regresamos a la url anterior
  regresar = () => history.back();

  errorPrecio(precioInput: NgModel): boolean {
    console.log();
    let precio = precioInput.control.value;
    if(!precio || precio < 0){
      return true;
    }
    return false;
  }
}
