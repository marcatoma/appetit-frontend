import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MedioPago } from 'src/app/models/caja/medio-pago';
import { Movimiento } from 'src/app/models/caja/movimiento';
import { BASE_URL } from 'src/environments/configurations';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
  private url: string = BASE_URL;
  constructor(private http: HttpClient) {}
  registrarMovimiento(movimiento: Movimiento): Observable<any> {
    return this.http
      .post(this.url + 'finalizar-pedido/crear-movimiento', movimiento)
      .pipe(
        map((response: any) => response),
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerMovimientosUsuario(id_usuario: number, page: number): Observable<any> {
    return this.http
      .get(
        this.url + 'get/movimientos/id_usuario/' + id_usuario + '/page/' + page
      )
      .pipe(
        map((response: any) => response.movimientos),
        catchError((e) => {
          console.log(e.error.mensaje, e.error.error);
          return throwError(e);
        })
      );
  }

  //listar arqueos paginado
  obtenerMovimientosFecha(
    desde: Date,
    hasta: Date,
    page: number
  ): Observable<any> {
    let api: string =
      'get/movimientos/from/' + desde + '/to/' + hasta + '/page/' + page;
    return this.http.get(this.url + api).pipe(
      map((response: any) => {
        return response.movimientos;
      }),
      catchError((e) => {
        console.log('Error service paginacion movimientos: ' + e.error);
        return throwError(e);
      })
    );
  }

  //obtener lista de medios de pago
  obtenerMediosPago(): Observable<MedioPago[]> {
    return this.http.get<MedioPago[]>(this.url + 'get/medio-pago');
  }
}
