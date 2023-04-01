import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
// modelos
import { Cliente } from 'src/app/models/persona/cliente';
// servicios
import { ClienteService } from 'src/app/services/cliente/cliente.service';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.css'],
})
export class FormClienteComponent implements OnInit {
  cliente: Cliente = new Cliente();
  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute
  ) {}
  erroresBackend: string[] = [];
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let id: number = +params.get('id');
      if (id) {
        this.clienteService.ObtenerClienteId(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }
    });
  }

  registrarCliente(): void {
    //validar los campos
    if (this.camposCompletos()) {
      //llamar al servicio
      this.clienteService.RegistrarCliente(this.cliente).subscribe(
        (res) => {
          this.cliente = new Cliente();
          this.erroresBackend = [];
          swal.fire({
            position: 'top-end',
            icon: 'success',
            title: res.mensaje,
            showConfirmButton: false,
            timer: 1000,
          });
        },
        (err) => {
          if (err.status === 409) {
            this.erroresBackend = err.error.errores as string[];
          } else {
            this.erroresBackend = [];
          }
        }
      );
    }
  }

  //verificar campos completos
  camposCompletos(): boolean {
    let c = this.cliente;
    //eliminar espacios del email
    this.cliente.email = this.cliente.email.replace(/ /g, '');
    if (
      c.nombres.length < 3 ||
      c.apellidos.length < 3 ||
      c.direccion.length < 3 ||
      c.email.length < 3
    ) {
      swal.fire(
        'Observación',
        'Completar todos los campos con almenos 3 carcateres.',
        'warning'
      );
      return false;
    } else {
      return true;
    }
  }
}
