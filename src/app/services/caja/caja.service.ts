import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Caja } from 'src/app/models/caja/caja';
import { BASE_URL } from 'src/environments/configurations';
import swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class CajaService {
  private url: string = BASE_URL;

  constructor(private http: HttpClient) {}

  obtenerTodasCajas(): Observable<Caja[]> {
    return this.http.get<Caja[]>(this.url + 'get/cajas/to-arqueos');
  }

  obtenerCajasPage(page: number): Observable<any> {
    return this.http.get(this.url + 'get/cajas/' + page).pipe(
      map(
        (response: any) => {
          return response.cajas;
        },
        catchError((e) => {
          console.log('Error service paginacion cajas: ' + e.error);
          return throwError(e);
        })
      )
    );
  }
  registrarCaja(caja: Caja): Observable<any> {
    return this.http.post(this.url + 'register/new/caja', caja).pipe(
      map(
        (response: any) => {
          return response;
        },
        catchError((e) => {
          if (e.status === 409) {
            return throwError(e);
          }
          return throwError(e);
        })
      )
    );
  }
  eliminarCaja(id: number): Observable<any> {
    return this.http.delete(this.url + '/delete/caja/' + id).pipe(
      map(
        (response: any) => {
          return response;
        },
        catchError((e) => {
          swal.fire(e.error.mensaje, e.error.error, 'warning');
          return throwError(e);
        })
      )
    );
  }
}
