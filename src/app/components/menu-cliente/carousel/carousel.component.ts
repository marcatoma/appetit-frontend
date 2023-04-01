import { Component, OnInit, Input } from '@angular/core';
import { Combo } from 'src/app/models/productos/combo';
import { Producto } from 'src/app/models/productos/producto';
import { BASE_URL } from 'src/environments/configurations';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @Input() productosEspeciales: Producto [] = [];
  @Input() combosEspeciales: Combo[] = [];
  @Input() tipo: string = '';
  api = BASE_URL;
  constructor() { }

  ngOnInit(): void {}

}
