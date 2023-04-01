import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
// modelos
import { Cliente } from 'src/app/models/persona/cliente';
// servicios
import { ClienteService } from 'src/app/services/cliente/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  //**************paginacion*********** */
  paginador: any;
  path: any = '/dashboard/cliente/page';
  //******************termina paginacion************ */
  clientes: Cliente[] = [];
  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listarClientesPaginado();
  }
  //listar clientes paginado
  listarClientesPaginado(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.listarClientesPaginado(page).subscribe((res) => {
        this.paginador = res.clientes;
        this.clientes = res.clientes.content;
        console.log(this.clientes);
      });
    });
  }
  //eliminar cliente logicamente
  eliminarClienteLogico(cli: Cliente): void {
    swal
      .fire({
        title: '¿Esta seguro?',
        text: 'Se eliminará este cliente de su lista.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.eliminarCliente(cli.id).subscribe((res) => {
            console.log(res);
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res,
              showConfirmButton: false,
              timer: 1000,
            });
            //listar los clientes nuevamente
            this.listarClientesPaginado();
          });
        }
      });
  }
}
