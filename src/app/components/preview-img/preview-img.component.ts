import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Configuracion url
import { BASE_URL } from 'src/environments/configurations';
// SweetAlert
import swal from 'sweetalert2';
@Component({
  selector: 'app-preview-img',
  templateUrl: './preview-img.component.html',
  styleUrls: ['./preview-img.component.css'],
})
export class PreviewImgComponent implements OnInit {
  @Input()  imagen: string;
  @Input()  pathImg: string;
  @Output() imagenSave: EventEmitter<File> = new EventEmitter();

  api:any = BASE_URL;
  imagenFile: File;
  img_url: any[];
  URL = BASE_URL;
  bandera = false;

  constructor() {}

  ngOnInit(): void {
  }

  // leer imagen
  onChange(event): void {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.img_url = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.bandera = true;
    }
    this.imagenFile = event.target.files[0];
    // mandamos el evento
    this.imagenSave.emit(this.imagenFile);
    if ( this.imagenFile && this.imagenFile.type.indexOf('image') < 0) {
      this.imagenFile = null;
      this.bandera = false;
      swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Ingrese solo imagenes',
        showConfirmButton: false,
        timer: 1000,
      });
    }
  }
  // metodos para compartir con el componente padre
  vaciarUrl(): void {
    this.img_url = null;
  }
  pasarURLImg( url: string ): void {
    this.pathImg = url;
    console.log(this.pathImg);
  }
}
