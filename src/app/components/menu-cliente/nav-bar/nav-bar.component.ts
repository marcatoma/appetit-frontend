import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import swal from 'sweetalert2';
// constantes
import { BASE_URL } from 'src/environments/configurations';
// modelos
import { Cliente } from 'src/app/models/persona/cliente';
import { DetalleComboPedido } from 'src/app/models/pedidos/detalle-combo-pedido';
import { DetallePedido } from 'src/app/models/pedidos/detalle-pedido';
import { Mesa } from 'src/app/models/mesa/mesa';
import { MesaService } from 'src/app/services/mesa/mesa.service';
import { Notificacion } from 'src/app/models/sockets/notificacion';
import { Pedido } from 'src/app/models/pedidos/pedido';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

//sock js
import { Client } from '@stomp/stompjs';
import * as SockJs from 'sockjs-client';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  public modalRef: NgbModalRef;
  //detalle de productos provenientes de productos component items
  itemsProducto: DetallePedido[] = [];
  itemsCombo: DetalleComboPedido[] = [];
  //id del pedido
  idPedido: number;
  modalRegistrar: any;
  pedido: Pedido = new Pedido();
  pedido_local: Pedido;
  id_mesa: number;
  cedula: string = 'none';
  notificacion: Notificacion = new Notificacion();

  //sockets
  api = BASE_URL;
  private client: Client;
  constructor(
    private modalService: NgbModal,
    private pedidoService: PedidoService,
    private mesaService: MesaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // llamo detecto evento del servicio pedidos cuando se agrega pedidos en productos component
    this.recuperarDelLocalStorage();
    //obtener la lista de productos/combos del componente producto/combo
    this.suscribirseEventoCambiosItems();

    this.PasarDetallePedido();
    //obtener el id de la mesa
    this.pedidoService.id_mesa$.subscribe((id_mesa) => {
      if (id_mesa) {
        this.id_mesa = id_mesa;
        this.ObtenerMesaId(id_mesa);
      }
    });
  }
  //************************SOCKETS****************** */
  //sockets
  conectar(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJs(this.api + 'chat-websocket');
    };
    //conectar a escuchar las notificaciones
    this.client.activate();
  }
  desconectar(): void {
    this.client.deactivate();
  }
  enviarNotificacion(): void {
    this.notificacion.texto =
      'Nuevo pedido para la mesa: ' + this.pedido.mesa.nombre;
    this.client.publish({
      destination: '/app/mensaje',
      body: JSON.stringify(this.notificacion),
    });
    this.notificacion.texto = '';
  }
  ///**********************TERMINA METODOS DE SOCKETS */

  postEnviarPedido(): void {
    if (this.pedido.items.length > 0 || this.pedido.combos.length > 0) {
      this.conectar();
      swal
        .fire({
          title: '¿Eres cliente?',
          input: 'number',
          inputPlaceholder: 'Ingrese su cédula',
          showDenyButton: true,
          confirmButtonColor: '#000',
          denyButtonColor: '#3085d6',
          confirmButtonText: `Enviar pedido`,
          denyButtonText: 'Registrarme',
          preConfirm: (val) => {
            if (val == '') {
              this.cedula = 'none';
            } else {
              this.cedula = val;
            }
          },
        })
        .then((result) => {
          console.log('value' + result.value);
          if (result.isDenied) {
            // si el cliente se quiere registrar sus datos
            this.cerrarModal();
            this.modalRegistrarCliente();
          } else if (result.isConfirmed) {
            // si solo quiere enviar los datos
            this.cerrarModal();
            this.enviarPedido();
          }
        });
    }
  }

  // este metodo se ejecuta cuando el cliente se registra y manda a guardar sus datos desde el componente formulario-cliente
  guardarEnviarDatos(bandera): void {
    if (bandera) {
      this.cerrarModal();
      // aqui llamamos metodo del pedido con el cliente
      this.enviarPedido();
    }
  }

  AsignarCliente(cliente: Cliente): void {
    if (cliente) {
      //asignado el cliente al pedido
      this.pedido.cliente = cliente;
    }
  }

  enviarPedido(): void {
    this.cerrarModal();
    swal.fire('Pedido', 'Enviado', 'success');
    if (this.pedido.items.length > 0 || this.pedido.combos.length > 0) {
      this.pedidoService
        .registrarPedido(this.pedido, this.cedula)
        .subscribe((res) => {
          this.enviarNotificacion();
          this.itemsProducto = [];
          this.pedidoService.items$.emit(this.itemsProducto);
          this.pedido = new Pedido();
          this.limpiarPedidoLocalStorage();
          this.guardarEnLocalStorageIdPedido(res.id_pedido);
          this.desconectar();
          //recuperar la mesa en el pedido
          if (this.id_mesa) {
            console.log('id mesa obtenido e el navbar');
            this.ObtenerMesaId(this.id_mesa);
            this.router.navigate(['/cliente/home/mesa/', this.id_mesa]);
          }
        });
    } else {
      swal.fire('Observación', 'Debe seleccionar productos', 'warning');
    }
  }

  // eliminar un producto de la lista del pedido
  eliminarProducto(id: number): void {
    this.pedido.items = this.pedido.items.filter(
      (item: DetallePedido) => id !== item.producto.id
    );
    this.PasarDetallePedido();
  }

  // eliminar un producto de la lista del pedido
  eliminarCombo(id: number): void {
    this.pedido.combos = this.pedido.combos.filter(
      (item: DetalleComboPedido) => id !== item.combo.id
    );
    this.PasarDetallePedido();
  }

  //calcular importe de cada producto
  public calcularImporte(cantidad: number, precio: number): number {
    let total = cantidad * precio;
    return Math.round(total * 100) / 100;
  }
  //calcular el total del poedido
  calcularTotal(): number {
    let total = 0;
    this.pedido.items.forEach((items: DetallePedido) => {
      total += this.calcularImporte(items.cantidad, items.producto.precio);
    });
    //combos
    this.pedido.combos.forEach((itemsCombo: DetalleComboPedido) => {
      total += this.calcularImporte(
        itemsCombo.cantidad,
        itemsCombo.combo.precio
      );
    });
    return Math.floor(total * 100) / 100;
  }

  // guardar pedido en el local storage
  guardarEnLocalStorage(pedido: Pedido): void {
    const now = new Date();
    const item = {
      value: pedido,
      expiry: now.getTime() + 1800000,
    };
    localStorage.setItem('pedido', JSON.stringify(item));
  }

  // recuperar pedid del local storage
  recuperarDelLocalStorage(): void {
    let pedido_local = localStorage.getItem('pedido');
    if (pedido_local) {
      const item = JSON.parse(pedido_local);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem('pedido');
      } else {
        this.pedido_local = item.value;
        if (this.pedido_local != null) {
          this.pedido = this.pedido_local;
          //recuperar los datos y enviar la lista de productos
        }
      }
    }
  }
  //pasar la nueva lista de productos al componente producto al refrescar la pagina
  PasarDetallePedido(): void {
    this.pedidoService.items$.emit(this.pedido.items);
    this.pedidoService.itemscombo$.emit(this.pedido.combos);
  }

  //guardar id de pedido en el local storage
  guardarEnLocalStorageIdPedido(id: number): void {
    const now = new Date();
    const item = {
      value: id,
      expiry: now.getTime() + 3600000,
    };
    localStorage.setItem('idPedido', JSON.stringify(item));
  }

  //limpiar el pedido del local storage
  limpiarPedidoLocalStorage(): void {
    localStorage.removeItem('pedido');
  }

  // recuperar id del pedido del lcoalstarage
  ObtenerIdPedidoLocalStorage(): void {
    let idPedido = localStorage.getItem('idPedido');
    if (idPedido) {
      const item = JSON.parse(idPedido);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem('idPedido');
      } else {
        this.idPedido = item.value;
      }
    }
  }

  //obtener la mesa por el id
  ObtenerMesaId(id: number): void {
    this.mesaService.ObtenerMesaId(id).subscribe((mes) => {
      this.pedido.mesa = mes as Mesa;
    });
  }

  //recuperar los datos del evento
  suscribirseEventoCambiosItems(): void {
    //obtener la lista de productos del componente producto
    this.pedidoService.items$.subscribe((items) => {
      this.pedido.items = items;
      this.guardarEnLocalStorage(this.pedido);
    });
    //obtener la lista de combos del componente combo
    this.pedidoService.itemscombo$.subscribe((items) => {
      this.pedido.combos = items;
      this.guardarEnLocalStorage(this.pedido);
    });
  }
  /////////////**************************************MODALESS */
  modalPedido(modal, modalRegistro): void {
    this.modalRef = this.modalService.open(modal, { centered: true });
    // para guardar la data del modal si desea o no resgistrarse el cliente
    this.modalRegistrar = modalRegistro;
  }
  modalNotificacion(modal): void {
    this.modalRef = this.modalService.open(modal, { centered: true });
  }
  modalRegistrarCliente(): void {
    this.modalRef = this.modalService.open(this.modalRegistrar, {
      centered: true,
      size: 'xl',
    });
  }
  cerrarModal(): void {
    this.modalRef.close();
  }
}
