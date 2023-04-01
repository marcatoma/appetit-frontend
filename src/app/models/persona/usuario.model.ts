import { Role } from './role.model';
import { Sexo } from './sexo.model';
export class Usuario {
  id: number;
  cedula: string = '';
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  sexo: Sexo;
  telefono: string = '';
  username: string = '';
  password: string = '';
  estado: boolean;
  roles: Role[] = [];
}
