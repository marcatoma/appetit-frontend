import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../../../environments/configurations';
import { Usuario } from '../../models/persona/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  ENPOINT = BASE_URL;
  private _usuario: Usuario;
  private _token: string;
  constructor(private http: HttpClient) {}
  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (
      this._usuario == null &&
      sessionStorage.getItem('usuario') != null
    ) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }
  logIn = (usuario: Usuario): Observable<any> => {
    const credenciales = btoa('appetitApp' + ':' + '12345');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales,
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(
      `${this.ENPOINT}oauth/token`,
      params.toString(),
      { headers: httpHeaders }
    );
  }

  guardarUsuario = (access_token: string): void => {    
    let payload = this.obtenerDatosToken(access_token);
    this._usuario = new Usuario();
    this._usuario.id = payload.id_usuario;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    // gurdamos en el localstorage
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }
  guardarToken = (access_token: string): void => {
    this._token = access_token;
    sessionStorage.setItem('token', this._token);
  }

  obtenerDatosToken = (access_token: string): any => {
    if (access_token !== null) {
      return JSON.parse(atob(access_token.split('.')[1]));
    }
    return null;
  }
  isAuthenticated = (): boolean => {
    let payload = this.obtenerDatosToken(this.token);
    if (payload !== null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  logOut = (): void => {
    this._token = null;
    this._usuario = null;
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
  }
  hasRole = (role: any): boolean => {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }
}
