import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
// modelos
import { Arqueo } from 'src/app/models/caja/arqueo';
import { Caja } from 'src/app/models/caja/caja';
import { Usuario } from 'src/app/models/persona/usuario.model';
// servicios
import { ArqueoService } from 'src/app/services/caja/arqueo.service';
import { CajaService } from 'src/app/services/caja/caja.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';

@Component({
  selector: 'app-abrir-arque-caja',
  templateUrl: './abrir-arque-caja.component.html',
  styleUrls: ['./abrir-arque-caja.component.css'],
})
export class AbrirArqueCajaComponent implements OnInit {
  arqueo: Arqueo = new Arqueo();
  cajas: Caja[] = [];
  usuarios: Usuario[] = [];
  errores: string[] = [];
  constructor(
    private cajaService: CajaService,
    private usuarioService: UsuarioService,
    private arqueoService: ArqueoService
  ) {}

  ngOnInit(): void {
    this.listarUsuarios();
    this.listarCajas();
  }
  listarUsuarios(): void {
    this.usuarioService.obtenerUsuariosToArqueo().subscribe((res) => {
      this.usuarios = res;
    });
  }
  listarCajas(): void {
    this.cajaService.obtenerTodasCajas().subscribe((res) => {
      this.cajas = res;
    });
  }
  //*********************************************
  ///resgistrar arqueo
  registrarArqueo(): void {
    console.log(this.arqueo);
    this.errores = [];
    this.arqueoService.registrarAperturaArqueo(this.arqueo).subscribe(
      (res) => {
        console.log(res);
        this.errores = [];
        swal.fire({
          position: 'top-end',
          icon: 'success',
          title: res.mensaje,
          showConfirmButton: false,
          timer: 1000,
        });
        this.arqueo = new Arqueo();
      },
      (err) => {
        if (err.status === 409) {
          this.errores = err.error.errores as string[];
        } else {
          swal.fire(err.error.mensaje, err.error.error, 'warning');
        }
      }
    );
  }
  //*********************************************

  //comparar-validar datos de Caja en boostrap
  compararCaja(o1: Caja, o2: Caja): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }

  //comparar-validar datos de usuarios en boostrap
  compararusuario(o1: Usuario, o2: Usuario): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }
}
