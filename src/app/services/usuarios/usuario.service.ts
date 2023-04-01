import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Role } from 'src/app/models/persona/role.model';
import { Sexo } from 'src/app/models/persona/sexo.model';
import { Usuario } from 'src/app/models/persona/usuario.model';
import { BASE_URL } from 'src/environments/configurations';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private http: HttpClient) {}
  private url: string = BASE_URL;

  obtenerUsuariosToArqueo(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url + 'get/usuarios/to-arqueos');
  }

  //paginar lista de usuarios
  obtenerUsuariosPageable(page: number): Observable<any> {
    return this.http.get(this.url + 'get/users/' + page).pipe(
      map((response: any) => {
        return response.usuarios;
      }),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  //bucar usuario por id
  obtenerUsuarioId(id: number): Observable<any> {
    return this.http.get(this.url + 'get/user/' + id).pipe(
      map((response: any) => response.usuario as Usuario),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  //bucar usuario por id para el perfil
  obtenerUsuarioIdPerfil(id: number): Observable<any> {
    return this.http.get(this.url + 'get/user/profile/' + id).pipe(
      map((response: any) => response.usuario as Usuario),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  //bucar usuario por id
  obtenerUsuarioIdMovimiento(id: number): Observable<any> {
    return this.http.get(this.url + 'get/user/movimiento/' + id).pipe(
      map((response: any) => response.usuario as Usuario),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  //listar roles de usuario
  obtenerusuarioRoles(): Observable<Role[]> {
    return this.http.get(this.url + 'get/user/roles').pipe(
      map((response: any) => response.roles as Role[]),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  obtenerUsuarioGeneros(): Observable<Sexo[]> {
    return this.http.get(this.url + 'get/user/sexos').pipe(
      map((response: any) => response.sexos as Sexo[]),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(this.url + 'register/user', usuario).pipe(
      map((response: any) => response),
      catchError((e) => {
        if (e.status === 409) {
          return throwError(e);
        } else {
          swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(e);
      })
    );
  }

  //actualizarUsuario
  actualizarUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(this.url + 'update/user', usuario).pipe(
      map((response: any) => response),
      catchError((e) => {
        if (e.status === 409) {
          return throwError(e);
        } else {
          swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(e);
      })
    );
  }

  //actualizar Usuario estado
  actualizarUsuarioEstado(usuario: Usuario): Observable<any> {
    return this.http.put(this.url + 'update/user/estado', usuario).pipe(
      map((response: any) => response),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  //metodo eliminar usuario
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(this.url + 'delete/user/' + id).pipe(
      map((response: any) => response.mensaje),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
