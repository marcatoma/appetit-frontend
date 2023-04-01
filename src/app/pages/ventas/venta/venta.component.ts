import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// constantes
import { BASE_URL } from 'src/environments/configurations';
// modelos
import { Combo } from 'src/app/models/productos/combo';
import { Cliente } from 'src/app/models/persona/cliente';
import { DetalleComboPedido } from 'src/app/models/pedidos/detalle-combo-pedido';
import { DetallePedido } from 'src/app/models/pedidos/detalle-pedido';
import { Estado } from 'src/app/models/pedidos/estado';
import { Mesa } from 'src/app/models/mesa/mesa';
import { MedioPago } from 'src/app/models/caja/medio-pago';
import { Movimiento } from 'src/app/models/caja/movimiento';
import { OperacionesCombos } from 'src/app/models/operaciones/operaciones-combos';
import { OperacionesProductos } from 'src/app/models/operaciones/operaciones-productos';
import { Pedido } from 'src/app/models/pedidos/pedido';
import { Producto } from 'src/app/models/productos/producto';
import { Usuario } from 'src/app/models/persona/usuario.model';
// servicios
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { ComboService } from 'src/app/services/combo/combo.service';
import { MesaService } from 'src/app/services/mesa/mesa.service';
import { MovimientoService } from 'src/app/services/caja/movimiento.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ProductoService } from 'src/app/services/productos/producto.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
})
export class VentaComponent implements OnInit {
  //lista de pedidos en memoria
  pedidosMemoria: Pedido[] = [];
  //api carga de imagenes
  api = BASE_URL;
  mesas: Mesa[] = [];
  radioIsProducto = true;
  cliente: Cliente = new Cliente();
  buscarClienteCedula = '';
  ConsumidorFinal = false;
  mesa: Mesa = new Mesa();
  estados: Estado[] = [];
  pedido: Pedido = new Pedido();
  comboDetalle: Combo;
  modalReference: NgbModalRef;
  tiposPago: MedioPago[] = [];
  movimiento: Movimiento = new Movimiento();
  MontoCambio: number = 0.0;
  Cambio: number = 0.0;

  constructor(
    private modalService: NgbModal,
    private mesaService: MesaService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private comboService: ComboService,
    private activatedRoute: ActivatedRoute,
    private movimientoService: MovimientoService,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  calcularCambio(event: any): void {
    console.log('cambio');
    this.Cambio =
      Math.floor((this.MontoCambio - this.calcularTotal()) * 100) / 100;
  }

  ngOnInit(): void {
    // cargar pedido en caso de haberlo
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = +params.get('id');
      if (id) {
        this.buscarPedido(id);
      }
    });
    // listar los estados del pedido
    this.listarEstadosPedido();
  }
  buscarPedido(id: number): void {
    this.pedidoService.obtenerPedidoPorId(id).subscribe((res) => {
      // reasignar los valores
      this.pedido = res;
      this.cliente = res.cliente;
      this.mesa = res.mesa;
      console.log(res);
    });
  }
  registrarPedido(): void {
    // asignar los valores al pedido
    this.pedido.cliente = this.cliente;
    this.pedido.mesa = this.mesa;
    this.pedido.fecha = new Date();
    this.pedido.total = this.calcularTotal();
    if (this.validarCampos()) {
      this.pedidoService.registrarPedidoAuth(this.pedido).subscribe((res) => {
        console.log(res);
        //restablecer valores
        this.buscarClienteCedula = '';
        this.ConsumidorFinal = false;
        this.pedido = new Pedido();
        this.cliente = new Cliente();
        this.mesa = new Mesa();
      });
    }
  }
  //finalizar el pedido de forma exitosa
  finalizarPedido(modalTipoPago): void {
    this.pedido.cliente = this.cliente;
    if (this.validarCampos()) {
      this.abrirModalTipoPago(modalTipoPago);
      let user = this.authService.usuario;
      if (user.id) {
        this.usuarioService.obtenerUsuarioIdMovimiento(user.id).subscribe(
          (res) => {
            this.movimiento.usuario = res;
          },
          (err) => {
            swal.fire('Error', 'No puedes continuar logueate nuevamente.');
            this.CerrarModal();
          }
        );
        this.movimiento.pedido = this.pedido;
      } else {
        swal.fire('No puede seguir error con el usuario', '', 'warning');
      }
    }
  }

  //enviarPedidoFinalizado
  enviarPedidoFinalizado(): void {
    console.log(this.movimiento);
    if (this.movimiento.tipoPago.id != undefined) {
      if (this.movimiento.tipoPago.id != 1) {
        if (!this.movimiento.tipoPago.folio) {
          swal.fire('Ingresar el numero de documento o fólio', '', 'warning');
        } else {
          this.enviarMovimiento();
        }
      } else {
        if (this.Cambio < 0) {
          return;
        } else {
          this.movimiento.monto_entregado = this.MontoCambio;
          this.movimiento.cambio_usuario = this.Cambio;
          this.enviarMovimiento();
        }
      }
    }
  }

  enviarMovimiento(): void {
    this.pedido.total = this.calcularTotal();
    this.movimientoService.registrarMovimiento(this.movimiento).subscribe(
      (res) => {
        console.log(res);
        this.CerrarModal();
        //restablecer valores
        this.buscarClienteCedula = '';
        this.ConsumidorFinal = false;
        this.pedido = new Pedido();
        this.cliente = new Cliente();
        this.mesa = new Mesa();
        this.movimiento = new Movimiento();
        console.log(this.movimiento);
      },
      (err) => {
        swal.fire(err.error.mensaje, err.error.error, 'warning');
      }
    );
  }

  obtenerMesas(): void {
    this.mesaService.ObtenerMesas().subscribe((res) => {
      this.mesas = res;
    });
  }
  seleccionarMesa(mesa: Mesa): void {
    this.mesa = mesa;
    this.pedido.mesa = this.mesa;
    this.CerrarModal();
  }

  listarEstadosPedido(): void {
    this.pedidoService.listarEstadosPedidos().subscribe((res) => {
      this.estados = res;
    });
  }

  compararEstados(o1: Estado, o2: Estado): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }

  compararMediosPago(o1: MedioPago, o2: MedioPago): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }

  buscarClientePorCedula(event: any): void {
    if (this.buscarClienteCedula) {
      this.clienteService
        .ClienteCedula(this.buscarClienteCedula)
        .subscribe((res) => {
          this.cliente = res;
          console.log(res);
        });
    }
  }
  ConsumidorFilanEstado(): void {
    this.buscarClienteCedula = '';
    if (this.ConsumidorFinal === true) {
      this.clienteService.ClienteCedula('9999999999').subscribe((res) => {
        this.cliente = res;
      });
    } else {
      this.cliente = new Cliente();
    }
  }
  AsignarCLienteRegistrado(cliente: Cliente): void {
    if (cliente) {
      this.cliente = cliente;
    } else {
      swal.fire('Observación', 'error cliente no obtenido', 'warning');
    }
  }
  SeleccionDeFiltrado(event: string): void {
    if (event === 'plato') {
      this.radioIsProducto = true;
    }
    if (event === 'combo') {
      this.radioIsProducto = false;
    }
  }
  // ------------------------------- filtrado de productos-----------------------------------//
  searchProductos = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      mergeMap((term) =>
        term ? this.productoService.getProductoByTerm(term) : []
      )
    );
  // para mostrar datos en la lista del input
  formatterProducto = (producto: Producto) =>
    producto.nombre +
    ' -> $' +
    producto.precio +
    ' -> ' +
    producto.categoria.nombre;
  dataP: Producto[] = [];
  // temina el formato

  seleccionarProducto = (prod: Producto) => {
    let operaciones: OperacionesProductos = new OperacionesProductos();
    let NuevoProducto: DetallePedido = new DetallePedido();
    // asignar el producto
    NuevoProducto.producto = prod;
    let existe = operaciones.existeProducto(prod.id, this.pedido.items);
    if (!existe) {
      this.pedido.items.push(NuevoProducto);
    } else {
      // incrementar la cantidad del producto en 1
      this.pedido.items = operaciones.incrementarCantidad(
        prod.id,
        1,
        this.pedido.items
      );
    }
    return '';
  };
  // termina el filtrado de productos
  // eliminar productos de pedido
  eliminarProdPedido(id: number): void {
    let operacion: OperacionesProductos = new OperacionesProductos();
    this.pedido.items = operacion.eliminarProducto(id, this.pedido.items);
  }
  // ------------------------------- filtrado de combos-----------------------------------//

  searchCombos = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      mergeMap((term) => (term ? this.comboService.getComboByTerm(term) : []))
    );
  // para mostrar datos en la lista del input
  formatterCombo = (combo: Combo) =>
    combo.nombre + ' -> $' + combo.precio + ' -> ' + combo.categoria.nombre;
  dataC: Combo[] = [];
  // temina el formato
  // funcion para agregar un combo al pedido
  seleccionarCombo = (combo: Combo) => {
    let operacion: OperacionesCombos = new OperacionesCombos();
    let NuevoCombo: DetalleComboPedido = new DetalleComboPedido();
    NuevoCombo.combo = combo;
    let existe = operacion.existeCombo(combo.id, this.pedido.combos);
    if (!existe) {
      this.pedido.combos.push(NuevoCombo);
    } else {
      // incrementar la cantidad del combo en 1
      this.pedido.combos = operacion.incrementarCantidad(
        combo.id,
        1,
        this.pedido.combos
      );
      // sumar cantidad
    }
    // restauramos la variable
    return '';
  };
  // eliminar combos del pedido
  eliminarComboPedido(id: number): void {
    let operacion: OperacionesCombos = new OperacionesCombos();
    this.pedido.combos = operacion.eliminarCombo(id, this.pedido.combos);
  }

  private pedidoConProductos(): boolean {
    let band = true;
    if (this.pedido.items.length === 0 && this.pedido.combos.length === 0) {
      band = false;
    }
    return band;
  }
  // validar opciones para registrar el pedido
  validarCampos(): boolean {
    let band = true;
    if (this.pedidoConProductos()) {
      let p = this.pedido;
      if (!p.cliente || !p.mesa || !p.estado) {
        swal.fire(
          'Observación',
          'Asegurese de seleccionar un cliente, mesa y estado del pedido',
          'warning'
        );
        band = false;
      }
    } else {
      swal.fire(
        'Observación',
        'Escoger productos y/o combos para el pedido.',
        'warning'
      );
      band = false;
    }
    return band;
  }
  // ---- calcular el total del pedido
  calcularTotal(): number {
    let total = 0.0;
    this.pedido.items.forEach((item: DetallePedido) => {
      total += this.calcularImporte(item.cantidad, item.producto.precio);
    });
    // combos
    this.pedido.combos.forEach((itemsCombo: DetalleComboPedido) => {
      total += this.calcularImporte(
        itemsCombo.cantidad,
        itemsCombo.combo.precio
      );
    });
    return Math.floor(total * 100) / 100;
  }

  // calcular importe de cada producto
  public calcularImporte(cantidad: number, precio: number): number {
    let total = cantidad * precio;
    return Math.round(total * 100) / 100;
  }

  restablecerCampos(): void {
    this.cliente = new Cliente();
    this.mesa = new Mesa();
    this.pedido = new Pedido();
  }

  CargarPedidoRecuperado(pedi: Pedido): void {
    if (pedi.cliente) {
      this.cliente = pedi.cliente;
    }
    if (pedi.mesa) {
      this.mesa = pedi.mesa;
    }
    this.pedido = pedi;
    this.eliminarPedidoLocal(pedi);
    this.CerrarModal();
  }
  eliminarPedidoLocal(ped: Pedido) {
    console.log('eliminar');
    this.pedidosMemoria = this.pedidosMemoria.filter(
      (item: Pedido) => ped.enEspera !== item.enEspera
    );
    this.guardarPedidoTemporal(null, '');
  }

  // obtener usuario para armar el movimiento
  obtenerUsuarioCorrespondiente(): Usuario {
    return new Usuario();
  }

  AlmacenarEnMemoria(): void {
    // guardar pedido en el local storage
    swal
      .fire({
        title: 'Ingresar un detalle para almacenar el pedido.',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        showLoaderOnConfirm: true,
        preConfirm: (val) => {
          if (!val) {
            swal.showValidationMessage('Ingrese una descripción.');
          }
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.guardarPedidoTemporal(this.pedido, result.value);
        }
      });
  }
  //guardar temporalmente pedidos
  guardarPedidoTemporal(pedido: Pedido, Descripcion): void {
    if (pedido) {
      pedido.cliente = this.cliente;
      pedido.enEspera = Descripcion;
      this.pedidosMemoria.push(pedido);
      //limpiar variables
      this.buscarClienteCedula = '';
      this.ConsumidorFinal = false;
      this.pedido = new Pedido();
      this.cliente = new Cliente();
      this.mesa = new Mesa();
    }
    const now = new Date();
    const item = {
      value: this.pedidosMemoria,
      expiry: now.getTime() + 1800000,
    };
    localStorage.setItem('pedidosMemoria', JSON.stringify(item));
  }
  // recuperar pedid del local storage
  recuperarPeidosEnMemoriaDelLocalStorage(): void {
    let pedidos_men = localStorage.getItem('pedidosMemoria');
    let pedidosmem: Pedido[] = [];
    if (pedidos_men) {
      const item = JSON.parse(pedidos_men);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem('pedidosMemoria');
      } else {
        pedidosmem = item.value;
        if (pedidosmem != null) {
          this.pedidosMemoria = pedidosmem;
        }
      }
    }
  }

  //obtener los medios de pagos
  listarMediosPagos(): void {
    this.movimientoService.obtenerMediosPago().subscribe((res) => {
      this.tiposPago = res;
    });
  }

  // ********************************************************************************************************* */
  // --------------funciones d elos modaless-----------------
  abrirModalCliente(modal): void {
    this.modalReference = this.modalService.open(modal, { size: 'xl' });
  }
  abrirModalMesa(modal): void {
    this.obtenerMesas();
    this.modalReference = this.modalService.open(modal, { scrollable: true });
  }
  abrirModalDetalle(modal, detallePedidoCombo: DetalleComboPedido): void {
    this.comboDetalle = detallePedidoCombo.combo;
    this.modalReference = this.modalService.open(modal, { scrollable: true });
  }
  abrirModalPedidosMen(modal): void {
    this.recuperarPeidosEnMemoriaDelLocalStorage();
    this.modalReference = this.modalService.open(modal, { scrollable: true });
  }
  abrirModalTipoPago(modal): void {
    this.Cambio = this.MontoCambio >= this.calcularTotal() ? this.MontoCambio - this.calcularTotal() : 0;
    this.listarMediosPagos();
    this.modalReference = this.modalService.open(modal, { scrollable: true });
  }
  CerrarModal(): void {
    this.modalReference.close();
  }
}
