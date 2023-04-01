import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from 'src/environments/configurations';
import { catchError, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Observable, throwError } from 'rxjs';
import { Producto } from 'src/app/models/productos/producto';
import { MensajesAlertaService } from '../mensajes-alerta.service';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private http: HttpClient, private mensajeService: MensajesAlertaService) { }
  private url: string = BASE_URL;

  // filtrar productos del cliente
  ObtenerProductosClientes(cate_id: number): Observable<any> {
    return this.http.get(this.url + 'get/client/products/' + cate_id).pipe(
      map((response: any) => response.productos as Producto[]),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // filtrar productos del cliente
  ObtenerProductosEspecialesClientes(): Observable<any> {
    return this.http.get(this.url + 'get/products/especiales').pipe(
      map((response: any) => response.productos as Producto[]),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // cambiar el estado del producto
  CambiarEstadoProducto(producto: Producto): Observable<any> {
    return this.http
      .put(this.url + 'actualizar/estado/producto', producto)
      .pipe(
        map((response: any) => {
          this.mensajeService.mensajeSweetInformacionToast('success', response.mensaje, 'top-end');
          return response.mensaje;
        }),
        catchError((e) => {
          swal.fire(e.error.error, e.error.mensaje, 'warning');
          return throwError(e);
        })
      );
  }

  // cambiar el estado del producto
  CambiarEstadoEspecialProducto(producto: Producto): Observable<any> {
    return this.http
      .put(this.url + 'actualizar/especial/producto', producto)
      .pipe(
        map((response: any) => {
          this.mensajeService.mensajeSweetInformacionToast('success', response.mensaje, 'top-end');
          return response.mensaje;
        }),
        catchError((e) => {
          swal.fire(e.error.error, e.error.mensaje, 'warning');
          return throwError(e);
        })
      );
  }

  // obtener productos por el id
  ObtenerProducto(id: number): Observable<Producto> {
    return this.http.get(this.url + 'get/product/' + id).pipe(
      map((response: any) => response.producto as Producto),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // obtener productos por paginacion
  ObtenerProductosPageable(page: number): Observable<any> {
    return this.http.get(this.url + 'get/products/' + page).pipe(
      map((response: any) => {
        return response.productos;
      }),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // registrar productos
  RegistarProducto(producto: Producto): Observable<Producto> {
    return this.http.post(this.url + 'register/product', producto).pipe(
      map((response: any) => response),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // actualizar productos
  updateProduct(producto: Producto): Observable<any> {
    return this.http
      .put(this.url + 'update/product/' + producto.id, producto)
      .pipe(
        map((response: any) => response),
        catchError((e) => {
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }
  // elimnar productos
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(this.url + 'delete/product/' + id).pipe(
      map((response: any) => response.mensaje),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // elimnar productos definitivamente por error de imagen
  deleteProductoDefinitive(id: number): Observable<any> {
    return this.http.delete(this.url + 'delete/product/definitivo/' + id).pipe(
      map((response: any) => response.mensaje),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // get productos por termino  a buscar
  getProductoByTerm(term: string): Observable<Producto[]> {
    return this.http.get(this.url + 'productos/cargar/' + term).pipe(
      map((response: any) => {
        console.log(response);
        return response.productos;
      }),
      catchError((e) => {
        return throwError(e);
      })
    );
  }
}
