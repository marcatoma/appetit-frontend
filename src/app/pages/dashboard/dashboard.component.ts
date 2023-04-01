import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/side-bar/sidebar.service';
import { SideBarModel } from '../../models/side-bar/sidebar.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  menu: SideBarModel[] = [
    {
      title: 'Pedidos',
      icon: 'fas fa-th-list',
      url: 'pedidos',
      roles: ['ROLE_ADMIN', 'ROLE_CAJERO', 'ROLE_MESERO'],
      subMenu: [],
    },
    {
      title: 'Realizar venta',
      icon: 'fas fa-shopping-cart',
      roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
      url: 'venta/:id',
      subMenu: []
    },
    {
      title: 'Ventas',
      icon: 'fas fa-list-alt',
      roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
      url: 'ventas/page/:page',
      subMenu: []
    },
    {
      title: 'Abrir Arqueo',
      icon: 'fas fa-dolly-flatbed',
      roles: ['ROLE_ADMIN'],
      url: 'creararqueo',
      subMenu: []
    },
    {
      title: 'Listar Arqueos',
      icon: 'fas fa-list-ul',
      roles: ['ROLE_ADMIN'],
      url: 'arqueos/page/:page',
      subMenu: []
    },
    {
      title: 'Agregar usuarios ',
      icon: 'fas fa-user-plus',
      roles: ['ROLE_ADMIN'],
      url: 'crearusu/:id',
      subMenu: []
    },
    {
      title: 'Agregar cliente ',
      icon: 'fas fa-user-plus',
      roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
      url: 'crearcli/:id',
      subMenu: []
    },
    {
      title: 'Agregar producto',
      icon: 'fa fa-plus-circle',
      roles: ['ROLE_ADMIN'],
      url: 'crearpro/:id',
      subMenu: []
    },
    {
      title: 'Categorias',
      icon: 'fa fa-tags',
      roles: ['ROLE_ADMIN'],
      url: 'categorias/page/0',
      subMenu: []
    },
    {
      title: 'Crear combo o promoción',
      icon: 'fas fa-hamburger',
      roles: ['ROLE_ADMIN'],
      url: 'crearcombo/:id',
      subMenu: []
    },
    {
      title: 'Mesas',
      icon: 'fas fa-chair',
      roles: ['ROLE_ADMIN'],
      url: 'mesas/page/0',
      subMenu: [],
    },
    {
      title: 'Configuración empresa',
      icon: 'fas fa-cog',
      roles: ['ROLE_ADMIN'],
      url: 'empresa',
      subMenu: []
    }
  ];
  ngOnInit(): void {

  }

}
