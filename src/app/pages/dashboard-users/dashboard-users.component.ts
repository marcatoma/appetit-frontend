import { Component, OnInit } from '@angular/core';
import { SideBarModel } from '../../models/side-bar/sidebar.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.css']
})
export class DashboardUsersComponent implements OnInit {

  constructor( private router: Router) { }
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
      title: 'Listar Movimientos Caja',
      icon: 'fas fa-luggage-cart',
      roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
      url: 'movimientos/page/:page',
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
      title: 'Lista de clientes ',
      icon: 'fas fa-address-book',
      roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
      url: 'cliente/page/0',
      subMenu: []
    }
  ];
  ngOnInit(): void {
  }
  navegar = ( url: string ) => {
    const path = '/dashboard/'+url;
    this.router.navigate([path]);
  }
}
