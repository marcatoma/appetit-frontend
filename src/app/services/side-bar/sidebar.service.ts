import { Injectable } from '@angular/core';
import { SideBarModel } from '../../models/side-bar/sidebar.model';
import { Usuario } from '../../models/persona/usuario.model';
import { SubMenuModel } from '../../models/side-bar/submenu.model';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  menuTipoRol: SideBarModel[] = [];
  subMenu: SubMenuModel[] = [];
  menu: SideBarModel[] = [
    {
      title: 'Inicio',
      icon: 'fas fa-home',
      url: '/',
      roles: ['ROLE_ADMIN'],
      subMenu: [],
    },
    {
      title: 'Inicio',
      icon: 'fas fa-home',
      url: 'user',
      roles: ['ROLE_COCINERO', 'ROLE_CAJERO'],
      subMenu: [],
    },
    {
      title: 'Pedidos',
      icon: 'fas fa-th-list',
      url: 'pedidos',
      roles: ['ROLE_ADMIN', 'ROLE_CAJERO', 'ROLE_MESERO'],
      subMenu: [],
    },
    {
      title: 'Ventas',
      icon: 'fas fa-file-invoice-dollar',
      url: '',
      roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
      subMenu: [
        {
          title: 'Realizar venta',
          icon: 'fas fa-shopping-cart',
          roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
          url: 'venta/:id',
        },
        {
          title: 'Ventas',
          icon: 'fas fa-list-alt',
          roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
          url: 'ventas/page/:page',
        },
      ],
    },
    {
      title: 'Caja',
      icon: 'fas fa-cash-register',
      url: '',
      roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
      subMenu: [
        {
          title: 'Crear Caja',
          icon: 'fas fa-briefcase',
          roles: ['ROLE_ADMIN'],
          url: 'crearcaja/page/:page',
        },
        {
          title: 'Abrir Arqueo',
          icon: 'fas fa-dolly-flatbed',
          roles: ['ROLE_ADMIN'],
          url: 'creararqueo',
        },
        {
          title: 'Listar Arqueos',
          icon: 'fas fa-list-ul',
          roles: ['ROLE_ADMIN'],
          url: 'arqueos/page/:page',
        },
        {
          title: 'Listar Movimientos Caja',
          icon: 'fas fa-luggage-cart',
          roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
          url: 'movimientos/page/:page',
        },
      ],
    },
    {
      title: 'Gestión de usuarios',
      icon: 'fas fa-users-cog',
      url: '',
      roles: ['ROLE_ADMIN'],
      subMenu: [
        {
          title: 'Agregar usuarios ',
          icon: 'fas fa-user-plus',
          roles: ['ROLE_ADMIN'],
          url: 'crearusu/:id',
        },
        {
          title: 'Lista de usuarios ',
          icon: 'fas fa-address-book',
          roles: ['ROLE_ADMIN'],
          url: 'usuarios/page/0',
        },
      ],
    },
    {
      title: 'Gestión de clientes',
      icon: 'fas fa-users',
      url: '',
      roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
      subMenu: [
        {
          title: 'Agregar cliente ',
          icon: 'fas fa-user-plus',
          roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
          url: 'crearcli/:id',
        },
        {
          title: 'Lista de clientes ',
          icon: 'fas fa-address-book',
          roles: ['ROLE_ADMIN', 'ROLE_CAJERO'],
          url: 'cliente/page/0',
        },
      ],
    },
    {
      title: 'Productos',
      icon: 'fas fa-box',
      url: '',
      roles: ['ROLE_ADMIN'],
      subMenu: [
        {
          title: 'Agregar producto',
          icon: 'fa fa-plus-circle',
          roles: ['ROLE_ADMIN'],
          url: 'crearpro/:id',
        },
        {
          title: 'Categorias',
          icon: 'fa fa-tags',
          roles: ['ROLE_ADMIN'],
          url: 'categorias/page/0',
        },
        {
          title: 'Lista de productos',
          icon: 'fas fa-list-alt',
          roles: ['ROLE_ADMIN'],
          url: 'productos/page/0',
        },
      ],
    },
    {
      title: 'Combos / Especiales',
      icon: 'fas fa-gifts ',
      url: '',
      roles: ['ROLE_ADMIN'],
      subMenu: [
        {
          title: 'Crear combo o promoción',
          icon: 'fas fa-hamburger',
          roles: ['ROLE_ADMIN'],
          url: 'crearcombo/:id',
        },
        {
          title: 'Lista combos',
          icon: 'fas fa-boxes',
          url: 'combos/page/0',
          roles: ['ROLE_ADMIN'],
        },
      ],
    },
    {
      title: 'Configuraciones',
      icon: 'fas fa-cogs',
      url: '',
      roles: ['ROLE_ADMIN'],
      subMenu: [
        {
          title: 'Configuración empresa',
          icon: 'fas fa-cog',
          roles: ['ROLE_ADMIN'],
          url: 'empresa',
        },
        {
          title: 'Mesas',
          icon: 'fas fa-chair',
          roles: ['ROLE_ADMIN'],
          url: 'mesas/page/0'
        }
      ],
    },
  ];
  verificarUsuarioRol = (): SideBarModel[] => {
    // cuando se vueve a llamar este metodo no se duplique el menu
    this.menuTipoRol = [];
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    // fitro por rol los menus principales
    this.menu.map((itemMenu: SideBarModel) => {
      itemMenu.roles.map((rol) => {
        // si cumple el rol se agrega al array
        if (usuario.roles.includes(rol)) {
          // luego vemos si los submenus cumple el rol se agregan al array
          itemMenu.subMenu.map((subMenuItem: SubMenuModel) => {
            subMenuItem.roles.map((rol) => {
              if (usuario.roles.includes(rol)) {
                this.subMenu.push(subMenuItem);
              }
            });
            itemMenu.subMenu = this.subMenu;
          });
          // reinicioamos el arrar de submenus
          this.subMenu = [];
          this.menuTipoRol.push(itemMenu);
        }
      });
    });
    return this.menuTipoRol;
  };
  constructor() {}
}
