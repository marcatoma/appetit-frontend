import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// constantes
import { BASE_URL, API_CATE } from 'src/environments/configurations';
// modelos
import { Categoria } from '../../models/productos/categoria';
import { TipoCategoria } from 'src/app/models/productos/tipo-categoria';
// servicios
import { CategoriaService } from 'src/app/services/categoria/categoria.service';
import { MensajesAlertaService } from '../../services/mensajes-alerta.service';
@Component({
  selector: 'app-categoria-listar',
  templateUrl: './categoria-listar.component.html',
  styleUrls: ['./categoria-listar.component.css'],
})
export class CategoriaListarComponent implements OnInit {
  categoria = new Categoria();
  // datos para pagnacion
  paginador: any;
  path: any = '/dashboard/categorias/page';
  // termina datos paginacion
  listaTipoCategorias: TipoCategoria[] = [];
  api: any = BASE_URL;
  listaCategorias: Categoria[] = [];
  imagenCategoria: File = null;
  pathImg: string;
  modalReference: NgbModalRef;
  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private categoriaService: CategoriaService,
    private mensajesService: MensajesAlertaService
  ) {}

  ngOnInit(): void {
    this.listarCategoriaspageable();
    this.listarTiposCategorias();
  }

  onChange(event): void {
    this.imagenCategoria = event.target.files[0];
    if (this.imagenCategoria.type.indexOf('image') < 0) {
      this.imagenCategoria = null;
      this.mensajesService.mensajeSweetFire('error', 'Solo imágenes', 'Error');
    }
  }

  // listar Tipo categorias
  listarTiposCategorias(): void {
    this.categoriaService.listarTiposCategorias().subscribe((res) => {
      this.listaTipoCategorias = res;
      console.log(res);
    });
  }

  private listarCategoriaspageable(): void {
    // listar todas las categorias sin excepcion.
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.categoriaService
        .ListaCategoriasPageable(page)
        .subscribe((categorias: any) => {
          this.listaCategorias = categorias.content;
          this.paginador = categorias;
          console.log(categorias.content);
        });
    });
  }

  openLg(content): void {
    this.categoria = new Categoria();
    // vaciamos el path al crear una nueva categoria
    this.pathImg = null;
    this.modalReference = this.modalService.open(content);
  }
  // abrimos modal con los datos de esa categoria
  abrirModalActualizarCate(MCategoria, cate: Categoria): void {    
    if (cate) {
      this.openLg(MCategoria);
      // cargamos los datos
      this.categoria = cate;
      // path para cargar img en el componente preview
      this.pathImg = 'category/img/' + this.categoria.imagen;
    }
  }
  // metodo para registrar categoria
  saveCategoria(): void {
    if (this.CamposLlenos()) {
      if (this.imagenCategoria) {
        // servicio para registrar las categorias
        this.categoria.estado = true;
        this.categoriaService
          .RegistarCategoria(this.categoria)
          .subscribe((res) => {
            this.cargarImagenCategoria(Number(res.id));
            console.log('categoria id: ' + res.id);
          });
      } else {
        this.mensajesService.mensajeSweetFire('warning', 'Debe seleccionar uma imágen.', 'Observación');
      }
    } else {
      this.mensajesService.mensajeSweetFire('warning', 'Debe llenar los campos.', 'Observación');
    }
  }

  // metodo para actualizar las categorias
  updateCategoria(): void {
    // validar los campos de la categoria
    if (this.CamposLlenos()) {
      if (this.imagenCategoria) {
        this.categoriaService
          .ActualizarCategoria(this.categoria)
          .subscribe((response) => {
            this.cargarImagenCategoria(Number(response.id));
            console.log(response);
            this.CerrarAllModals();
            this.listarCategoriaspageable();
          });
        // si no existe un archivo o el archivo de imagen es erroneo se verifica que exista un nombre de imagenCategoria
        // en el backend y si existe se pasa a actualizar la categoria a excepcion de la imagen
      } else {
        if (!this.categoria.imagen) {
          // si no existe un nombre de imagen no se puede actualizar.
          this.mensajesService.mensajeSweetFire('warning', 'Debe seleccionar su imagen', 'Advertencia');
        } else {
          this.categoriaService.ActualizarCategoria(this.categoria).subscribe(
            (response) => {
              console.log('Categoria actualizado');
              this.listarCategoriaspageable();
              this.CerrarAllModals();
            },
            (error) => {
              console.log(error.mensaje);
            }
          );
        }
      }
    } else {
      this.mensajesService.mensajeSweetFire('warning', 'Debe llenar los campos', 'Observación');
    }
  }

  CerrarModal(): void {
    this.modalReference.close();
  }

  CerrarAllModals(): void {
    this.modalService.dismissAll();
  }

  cargarImagenCategoria(id: number): void {
    this.categoriaService
      .saveImgCategoria_Producto(this.imagenCategoria, id, API_CATE, '')
      .subscribe(
        (res) => {
          // alerta de mensaje al guardar el
          this.mensajesService.mensajeSweetFireToast('success', 'Categoría registrada correctamente', 'top-end');
          // termina alerta
          // restablecer variables
          console.log('guardado');
          this.imagenCategoria = null;
          this.listarCategoriaspageable();
          this.CerrarAllModals();
        },
        (error) => {
          this.categoriaService
            .deleteCategoriaDefinitive(id)
            .subscribe((res) => {});
          console.log('error');
          console.log(error);
          this.imagenCategoria = null;
        }
      );
  }

  CamposLlenos(): boolean {
    let band = false;
    const cat = this.categoria;
    if (cat.nombre.length > 2 && cat.tipo) {
      band = true;
    }
    return band;
  }

  // comparar-validar datos de tipo categorias en boostrap
  compararCategoria(o1: TipoCategoria, o2: TipoCategoria): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }

  eliminarCategoria(idCategoria: number): void {
    this.mensajesService
            .confirmDialogSweet(
              'warning',
              '¿Eliminar esta categoría...?',
              'Sí ud elimina esta categoría es posible que pierda productos y recibos relacionadas con esta categoría.',
              'Si, no hay problema'
            ).then((result) => {
              if (result.isConfirmed) {
                this.categoriaService
                  .deleteCategoria(idCategoria)
                  .subscribe((res) => {
                    this.listarCategoriaspageable();
                    this.mensajesService.mensajeSweetInformacion('success', res, 'top-end');
                    console.log(res);
                  });
              }
            });
  }
}
