import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modulos creados
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { AbrirArqueCajaComponent } from './caja/abrir-arque-caja/abrir-arque-caja.component';
import { CategoriaListarComponent } from './categoria/categoria-listar.component';
import { ConfiguracionEmpresaComponent } from './configuraciones/configuracion-empresa/configuracion-empresa.component';
import { CrearCajaComponent } from './caja/crear-caja/crear-caja.component';
import { ClientesComponent } from './clientes/clientes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardUsersComponent } from './dashboard-users/dashboard-users.component';
import { FormularioUsuarioComponent } from './usuarios/formulario-usuario/formulario-usuario.component';
import { FormularioComponent } from './producto/formulario/formulario.component';
import { FormularioComboComponent } from './producto/formulario-combo/formulario-combo.component';
import { FormClienteComponent } from './clientes/form-cliente/form-cliente.component';
import { ListarArqueosComponent } from './caja/listar-arqueos/listar-arqueos.component';
import { ListaCombosComponent } from './producto/lista-combos/lista-combos.component';
import { ListarMovimientosCajaComponent } from './caja/listar-movimientos-caja/listar-movimientos-caja.component';
import { ListaVentasComponent } from './ventas/lista-ventas/lista-ventas.component';
import { MesasComponent } from './configuraciones/mesas/mesas.component';
import { MiPerfilComponent } from './usuarios/mi-perfil/mi-perfil.component';
import { MiCuentaComponent } from './usuarios/mi-cuenta/mi-cuenta.component';
import { PagesComponent } from './pages.component';
import { ProductoListarComponent } from './producto/producto-listar.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VentaComponent } from './ventas/venta/venta.component';

// directives
import { ErrorMsgDirective } from '../directives/error-msg.directive';

// pipes
import { EstadoMesaPipe } from '../pipes/estado-mesa.pipe';

//qr code
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AbrirArqueCajaComponent,
    CategoriaListarComponent,
    ConfiguracionEmpresaComponent,
    CrearCajaComponent,
    ClientesComponent,
    DashboardComponent,
    FormularioUsuarioComponent,
    FormularioComponent,
    FormularioComboComponent,
    FormClienteComponent,
    ListarArqueosComponent,
    ListaCombosComponent,
    ListarMovimientosCajaComponent,
    ListaVentasComponent,
    MesasComponent,
    MiPerfilComponent,
    MiCuentaComponent,
    PagesComponent,
    ProductoListarComponent,
    PedidosComponent,
    UsuariosComponent,
    VentaComponent,
    DashboardUsersComponent,

    EstadoMesaPipe,

    ErrorMsgDirective,


  ],
  exports: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    QRCodeModule
  ],
})
export class PagesModule {}
