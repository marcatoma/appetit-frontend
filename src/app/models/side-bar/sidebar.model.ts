import { SubMenuModel } from './submenu.model';
export class SideBarModel {
  title: string;
  icon: string;
  url: string;
  roles:string[]=[];
  subMenu: SubMenuModel[] = [];
}
