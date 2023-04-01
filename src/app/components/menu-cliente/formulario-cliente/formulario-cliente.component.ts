import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// ngboostrap
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
// modelos
import { Cliente } from 'src/app/models/persona/cliente';
// servicios
import { ClienteService } from 'src/app/services/cliente/cliente.service';

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  styleUrls: ['./formulario-cliente.component.css'],
})
export class FormularioClienteComponent implements OnInit {
  @Output() registrocliente: EventEmitter<boolean> = new EventEmitter();
  @Output() reclienteRetorno: EventEmitter<Cliente> = new EventEmitter();
  @Input() cerrarModalRef: NgbModalRef;
  @Input() ocultarBotones: boolean;
  //alcena errores del backend
  erroresBackend: string[] = [];

  cliente: Cliente = new Cliente();
  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {}

  registrarCliente(): void {
    console.log(this.cliente);
    //validar los campos
    if (this.camposCompletos()) {
      //llamar al servicio
      this.clienteService.RegistrarCliente(this.cliente).subscribe(
        (res) => {
          //asignamos el cliente de retorno al evento
          this.reclienteRetorno.emit(res.cliente);
          //asignamos la ceptacion del pedido
          //this.cerrarModal();
          this.cliente = new Cliente();
          this.registrocliente.emit(true);
          if (this.ocultarBotones) {
            this.cerrarModal();
          }
        },
        (err) => {
          if (err.status === 409) {
            this.erroresBackend = err.error.errores as string[];
          }
        }
      );
    }
  }

  cerrarModal(): void {
    this.cerrarModalRef.close();
  }

  //verificar campos completos
  camposCompletos(): boolean {
    let c = this.cliente;
    //eliminar espacios del email
    this.cliente.email = this.cliente.email.replace(/ /g, '');
    console.log(this.cliente);

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
