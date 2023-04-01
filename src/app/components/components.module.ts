import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

// ngbootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CategoriasClienteComponent } from './menu-cliente/categorias-cliente/categorias-cliente.component';
import { CarouselComponent } from './menu-cliente/carousel/carousel.component';
import { ClienteMesaComponent } from './menu-cliente/mesa/mesa.component';
import { ClienteSidebarComponent } from './menu-cliente/cliente-sidebar/cliente-sidebar.component';
import { CombosComponent } from './menu-cliente/combos/combos.component';
import { FormularioClienteComponent } from './menu-cliente/formulario-cliente/formulario-cliente.component';
import { HomeClienteComponent } from './menu-cliente/home-cliente/home-cliente.component';
import { MenuClienteComponent } from './menu-cliente/menu-cliente.component';
import { NavBarComponent } from './menu-cliente/nav-bar/nav-bar.component';
import { PreviewImgComponent } from './preview-img/preview-img.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ProductosComponent } from './menu-cliente/productos/productos.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    PreviewImgComponent,
    PaginatorComponent,
    SpinnerComponent,
    MenuClienteComponent,
    NavBarComponent,
    CarouselComponent,
    ProductosComponent,
    CategoriasClienteComponent,
    ClienteSidebarComponent,
    HomeClienteComponent,
    FormularioClienteComponent,
    ClienteMesaComponent,
    CombosComponent,
  ],
  exports: [
    PreviewImgComponent,
    PaginatorComponent,
    SpinnerComponent,
    CategoriasClienteComponent,
    FormularioClienteComponent,
  ],
  imports: [CommonModule, FormsModule, NgbModule, SharedModule, RouterModule],
})
export class ComponentsModule {}
