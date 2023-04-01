import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Combo } from 'src/app/models/productos/combo';
import { BASE_URL } from 'src/environments/configurations';
import swal from 'sweetalert2';
import { MensajesAlertaService } from '../mensajes-alerta.service';

@Injectable({
  providedIn: 'root',
})
export class ComboService {
  constructor(private http: HttpClient, private mensajesService: MensajesAlertaService) {}
  private url: string = BASE_URL;
  registrarCombo(combo: Combo): Observable<any> {
    return this.http.post(this.url + 'registrar/combo', combo).pipe(
      map((response: any) => response),
      catchError((e) => {
        if (e.status === 409) {
          console.log(e);
        }
        swal.fire(e.error.mensaje, e.error.error, 'warning');
        return throwError(e);
      })
    );
  }
  // lista las categorias para los combos
  listarCategoriasCombo(): Observable<any> {
    return this.http.get(this.url + 'get/categories/combos').pipe(
      map((response: any) => response),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // pagina todos los combos
  listarCombosPageable(page: number): Observable<any> {
    return this.http.get(this.url + 'get/combos-disponibles/' + page).pipe(
      map((response: any) => response),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // filtrar combos para el cliente
  ObtenerCombosClientes(cate_id: number): Observable<any> {
    return this.http.get(this.url + 'get/client/combos/' + cate_id).pipe(
      map((response: any) => response.combos as Combo[]),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // filtrar combos para el cliente
  ObtenerCombosEspecialesClientes(): Observable<any> {
    return this.http.get(this.url + 'get/especiales/combos').pipe(
      map((response: any) => response.combos as Combo[]),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  obtenerComboId(id: number): Observable<any> {
    return this.http.get(this.url + 'get/combo/' + id).pipe(
      map((response: any) => response),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // cambiar el estado del combo
  CambiarEstadoCombo(combo: Combo): Observable<any> {
    return this.http.put(this.url + 'actualizar/estado/combo', combo).pipe(
      map((response: any) => {
        this.mensajesService.mensajeSweetInformacionToast('success', response.mensaje, 'top-end');
        return response.mensaje;
      }),
      catchError((e) => {
        swal.fire(e.error.error, e.error.mensaje, 'warning');
        return throwError(e);
      })
    );
  }

    // cambiar el estado especiales del combo
    CambiarEstadoEspecialCombo(combo: Combo): Observable<any> {
      return this.http.put(this.url + 'actualizar/especial/combo', combo).pipe(
        map((response: any) => {
          this.mensajesService.mensajeSweetInformacionToast('success', response.mensaje, 'top-end');
          return response.mensaje;
        }),
        catchError((e) => {
          swal.fire(e.error.error, e.error.mensaje, 'warning');
          return throwError(e);
        })
      );
    }

  // get productos por termino  a buscar
  getComboByTerm(term: string): Observable<Combo[]> {
    return this.http.get(this.url + 'combos/cargar/' + term).pipe(
      map((response: any) => {
        return response.combos;
      }),
      catchError((e) => {
        return throwError(e);
      })
    );
  }
}
