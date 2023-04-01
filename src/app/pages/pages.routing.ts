import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// guards
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

import { AbrirArqueCajaComponent } from './caja/abrir-arque-caja/abrir-arque-caja.component';
import { CategoriaListarComponent } from './categoria/categoria-listar.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CrearCajaComponent } from './caja/crear-caja/crear-caja.component';
import { ConfiguracionEmpresaComponent } from './configuraciones/configuracion-empresa/configuracion-empresa.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardUsersComponent } from './dashboard-users/dashboard-users.component';
import { FormularioComponent } from './producto/formulario/formulario.component';
import { FormularioComboComponent } from './producto/formulario-combo/formulario-combo.component';
import { FormularioUsuarioComponent } from './usuarios/formulario-usuario/formulario-usuario.component';
import { FormClienteComponent } from './clientes/form-cliente/form-cliente.component';
import { ListaCombosComponent } from './producto/lista-combos/lista-combos.component';
import { ListarArqueosComponent } from './caja/listar-arqueos/listar-arqueos.component';
import { ListarMovimientosCajaComponent } from './caja/listar-movimientos-caja/listar-movimientos-caja.component';
import { ListaVentasComponent } from './ventas/lista-ventas/lista-ventas.component';
import { MesasComponent } from './configuraciones/mesas/mesas.component';
import { PagesComponent } from './pages.component';
import { ProductoListarComponent } from './producto/producto-listar.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VentaComponent } from './ventas/venta/venta.component';
import { MiPerfilComponent } from './usuarios/mi-perfil/mi-perfil.component';
import { MiCuentaComponent } from './usuarios/mi-cuenta/mi-cuenta.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Inicio',
          subTitle: 'Bienvenido',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'user',
        component: DashboardUsersComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Inicio',
          subTitle: 'Bienvenido',
          role: [
            'ROLE_COCINERO',
            'ROLE_CAJERO',
            'ROLE_MESERO',
          ],
        },
      },
      {
        path: 'crearpro/:id',
        component: FormularioComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Productos',
          subTitle: 'Administrar producto',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'crearcombo/:id',
        component: FormularioComboComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Especiales',
          subTitle: 'Crea tus propios combos o promociones',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'usuarios/page/0',
        component: UsuariosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Usuarios',
          subTitle: 'Administrar tus usuarios',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'crearcaja/page/:page',
        component: CrearCajaComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Caja',
          subTitle: 'Ver y agregar cajas',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'creararqueo',
        component: AbrirArqueCajaComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Nuevo Arqueo',
          subTitle: 'Crea y asigna un nuevo arqueo',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'crearcli/:id',
        component: FormClienteComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Nuevo cliente',
          subTitle: 'Agrega clientes',
          role: ['ROLE_ADMIN', 'ROLE_CAJERO'],
        },
      },
      {
        path: 'cliente/page/:page',
        component: ClientesComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Clientes',
          subTitle: 'Detalles de clientes',
          role: ['ROLE_ADMIN', 'ROLE_CAJERO'],
        },
      },
      {
        path: 'arqueos/page/:page',
        component: ListarArqueosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Arqueos',
          subTitle: 'Detalles de arqueos',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'movimientos/page/:page',
        component: ListarMovimientosCajaComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Movimientos caja',
          subTitle: 'Detalles de las transacciones del arqueo actual',
          role: ['ROLE_ADMIN', 'ROLE_CAJERO'],
        },
      },
      {
        path: 'crearusu/:id',
        component: FormularioUsuarioComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Usuarios',
          subTitle: 'Agrega usuarios',
          role: ['ROLE_ADMIN'],
        },
      }, /// estoy
      {
        path: 'perfil/:id',
        component: MiPerfilComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Mi perfil',
          subTitle: 'Actualizar mis datos',
          role: ['ROLE_ADMIN', 'ROLE_CAJERO'],
        },
      },
      {
        path: 'cuenta/:id',
        component: MiCuentaComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Mi cuenta',
          subTitle: 'Actualizar mis datos',
          role: ['ROLE_ADMIN', 'ROLE_CAJERO'],
        },
      },
      /// termina
      {
        path: 'productos/page/:page',
        component: ProductoListarComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Productos',
          subTitle: 'Lista de productos',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'combos/page/:page',
        component: ListaCombosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Combos',
          subTitle: 'Lista de combos u otros especiales',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'categorias/page/:page',
        component: CategoriaListarComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Categorías',
          subTitle: 'Administra tus categorías',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'mesas/page/:page',
        component: MesasComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Mesas',
          subTitle: 'Administrar mesas del Restaurante',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'empresa',
        component: ConfiguracionEmpresaComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Empresa ',
          subTitle: 'Configura los datos de tu empresa',
          role: ['ROLE_ADMIN'],
        },
      },
      {
        path: 'pedidos',
        component: PedidosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Pedidos',
          subTitle: 'Revisa los pedidos de tus clientes',
          role: ['ROLE_ADMIN', 'ROLE_CAJERO'],
        },
      },
      {
        path: 'venta/:id',
        component: VentaComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Venta',
          subTitle: 'Realizar pedidos personales',
          role: ['ROLE_ADMIN', 'ROLE_CAJERO'],
        },
      },
      {
        path: 'ventas/page/:page',
        component: ListaVentasComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'Ventas',
          subTitle: 'Lista de ventas',
          role: ['ROLE_ADMIN', 'ROLE_CAJERO'],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
