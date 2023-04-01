import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from 'src/app/services/side-bar/sidebar.service';
import { SideBarModel } from '../../models/side-bar/sidebar.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit{
  menuItems: SideBarModel [] = [];
  constructor( 
    private sidebarService: SidebarService,
    public authService: AuthService
    ) {
    }
    ngOnInit(): void {
      this.menuItems = this.sidebarService.verificarUsuarioRol();
    }

}
