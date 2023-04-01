import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_PROD, BASE_URL } from 'src/environments/configurations';
import { catchError, map } from 'rxjs/operators';
import { Categoria } from 'src/app/models/productos/categoria';
import { Observable, throwError } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private url: string = BASE_URL;
  constructor(private http: HttpClient) {}

  RegistarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post(this.url + 'register/category', categoria).pipe(
      map((response: any) => response),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  listarTiposCategorias(): Observable<any> {
    return this.http.get(this.url + 'get/tipo-categorias').pipe(
      map((response: any) => response),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  ActualizarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http
      .put(this.url + 'update/category/' + categoria.id, categoria)
      .pipe(
        map((response: any) => response),
        catchError((e) => {
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  ListaTodasCategorias(): Observable<Categoria[]> {
    return this.http.get(this.url + 'get/categories').pipe(
      map((response: any) => response.categorias as Categoria[]),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  ListaCategoriasProductos(): Observable<any> {
    return this.http.get(this.url + 'get/categories/products').pipe(
      map((response: any) => response.categorias as Categoria[]),
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  ListaCategoriasPageable(page: number): Observable<any> {
    return this.http.get(this.url + 'get/categories/' + page).pipe(
      map((response: any) => {
        return response.categorias;
      }),
      catchError((e) => {
        console.log('Error service paginacion cate: ' + e.error);

        return throwError(e);
      })
    );
  }

  //gurdar imagen producto-categoria
  saveImgCategoria_Producto(
    archivo: File,
    id,
    api: string,
    tipo: string
  ): Observable<any> {
    let formDataImg = new FormData();
    //para guardar productos y combos
    if (api == API_PROD) {
      formDataImg.append('tipo', tipo);
    }
    formDataImg.append('archivo', archivo);
    formDataImg.append('id', id);
    return this.http.post(this.url + api, formDataImg).pipe(
      map((response: any) => response.mensaje),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(this.url + 'delete/category/' + id).pipe(
      map((response: any) => response.mensaje),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  //eliminar definitivamente por error de imagen
  deleteCategoriaDefinitive(id: number): Observable<any> {
    return this.http.delete(this.url + 'delete/category/definitive/' + id).pipe(
      map((response: any) => response.mensaje),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
