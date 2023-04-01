import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
//sockets
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Notificacion } from '../models/sockets/notificacion';
// constante
import { BASE_URL } from 'src/environments/configurations';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnInit {
  api = BASE_URL;
  //sockets
  private client: Client;
  conectado: boolean = false;
  notificacion: Notificacion = new Notificacion();
  constructor() {}

  ngOnInit(): void {
    this.ConectarSocket();
  }
  //conexion sockets para notificaciones
  ConectarSocket(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS(this.api + 'chat-websocket');
    };
    //conectar a escuchar las notificaciones
    this.client.activate();
    this.client.onConnect = (frame) => {
      console.log('conectados ' + this.client.connected + ' : ' + frame);
      this.conectado = true;
      this.client.subscribe('/chat/mensaje', (e) => {
        let notificacion: Notificacion = JSON.parse(e.body) as Notificacion;
        console.log(notificacion);
        this.notificacionPantalla(notificacion);
      });
    };
  }

  notificacionPantalla(notificacion: Notificacion): void {
    swal.fire({
      position: 'top-end',
      icon: 'success',
      title: notificacion.texto,
      showConfirmButton: false,
      timer: 4000,
    });
  }
}
