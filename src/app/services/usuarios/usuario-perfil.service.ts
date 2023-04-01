import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../../environments/configurations';
import { PasswordRecovery, UserNameRecovery } from '../../models/persona/user-perfil.model';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/persona/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioPerfilService {
  private _url: string = BASE_URL;
  constructor(
    private _http: HttpClient,
    
  ) { }

  recoveryPassword = (recovery: PasswordRecovery): Observable<any> =>  {
    return this._http.put<any>(`${this._url}update/user/password`, recovery);
  }
  recoveryUserName = (recoveryUsername: UserNameRecovery, id: number): Observable<any> =>  {
    return this._http.put<any>(`${this._url}update/user/username/${id}`, recoveryUsername);
  }
  updatePerfilUser = (usuario: Usuario): Observable<any> =>  {    
    return this._http.put<any>(`${this._url}update/user/profile`, usuario);
  }

}
