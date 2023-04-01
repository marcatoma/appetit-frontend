import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cliente } from 'src/app/models/persona/cliente';
import { BASE_URL } from 'src/environments/configurations';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private url: string = BASE_URL;
  constructor(private http: HttpClient) {}

  //listar
  ObtenerClienteId(id: number): Observable<any> {
    return this.http.get(this.url + 'cliente/find-by-id/' + id).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'warning');
        return throwError(e);
      })
    );
  }

  //listar
  listarClientesPaginado(page: number): Observable<any> {
    return this.http.get(this.url + 'get/clientes/page/' + page).pipe(
      map((response: any) => response),
      catchError((e) => {
        console.log(e.error.mensaje, e.error.error, 'warning');
        return throwError(e);
      })
    );
  }

  //obtener cliente por cedula
  ClienteCedula(cedula: string): Observable<any> {
    return this.http.get(this.url + 'cliente/findbyced/' + cedula).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'warning');
        return throwError(e);
      })
    );
  }

  //registrar cliente
  RegistrarCliente(cliente: Cliente): Observable<any> {
    return this.http.post(this.url + 'client/register/client', cliente).pipe(
      map((response: any) => response),
      catchError((e) => {
        if (e.status === 409) {
          return throwError(e);
        }
        swal.fire(e.error.mensaje, e.error.error, 'warning');
        return throwError(e);
      })
    );
  }

  //eliminar clientes
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(this.url + 'cliente/delete/' + id).pipe(
      map((response: any) => response.mensaje),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
