import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { MenuClienteComponent } from './menu-cliente/menu-cliente.component';
import { ProductosComponent } from './menu-cliente/productos/productos.component';
import { HomeClienteComponent } from './menu-cliente/home-cliente/home-cliente.component';
import { FormularioClienteComponent } from './menu-cliente/formulario-cliente/formulario-cliente.component';
import { ClienteMesaComponent } from './menu-cliente/mesa/mesa.component';
import { CombosComponent } from './menu-cliente/combos/combos.component';
const routes: Routes = [
  {
    path: 'cliente',
    component: MenuClienteComponent,
    children: [
      { path: 'home/mesa/:id_mesa', component: HomeClienteComponent },
      { path: 'menu/:id_cate', component: ProductosComponent },
      { path: 'menu/combo/:id', component: CombosComponent },
      { path: 'formulario/registro', component: FormularioClienteComponent },
      { path: 'mesas', component: ClienteMesaComponent },
      { path: '**', redirectTo: 'mesas' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsRoutingModule {}
