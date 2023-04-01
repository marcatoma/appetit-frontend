import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// ng boostrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// modelos
import { Usuario } from '../../models/persona/usuario.model';
// servicios
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { MensajesAlertaService } from '../../services/mensajes-alerta.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  listaUsuarios: Usuario[] = [];
  usuario!: Usuario;
  // variable contenedor de los datos de la paginacion de usuarios
  paginador: any;
  path: any = '/dashboard/usuarios/page';

  modalReference: NgbModalRef;
  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private mensajeService: MensajesAlertaService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.listarUsuarios();
  }
  // paginar lista de usuarios
  listarUsuarios(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.usuarioService.obtenerUsuariosPageable(page).subscribe((res) => {
        this.listaUsuarios = res.content;
        this.paginador = res;
        console.log(res.content);
      });
    });
  }

  // eliminar usuario por id
  eliminarUsuario(id: number): void {
    this.mensajeService
          .confirmDialogSweet(
            'warning',
            '¿Eliminar usuario...?',
            'Sí elimina este usuario es posible que pierda datos importantes',
            'Si, no hay problema'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.eliminarUsuario(id).subscribe((res) => {
            this.listarUsuarios();
            this.mensajeService.mensajeSweetInformacion('success', res, 'top-end');
            console.log(res);
          });
        }
      });
  }

  abrirModalDetalles = (modalDetalles: TemplateRef<NgbModalRef>,  usuario: Usuario): void => {
    console.log(modalDetalles);
    this.usuario = usuario;
    this.modalReference = this.modalService.open(modalDetalles);
  }
}
