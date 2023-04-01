import { Directive, ElementRef, Input, SimpleChanges, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[appDrErrorMsg]'
})
export class ErrorMsgDirective implements OnInit, OnChanges{
  private _color: string = 'red';
  private _mensaje: string = 'Este campo es requerido';
  private _valido: boolean = false;
  public htmlElement: ElementRef<HTMLElement>;
  @Input() public set color(valor: string){
    this._color = valor;
    this.setColor();
  }
  // @Input() public mensaje: string = 'Este campo es requerido';
  @Input() public set mensaje(msg: string ){
    this._mensaje = msg;
    this.setMensaje();
  }
  @Input() public set valido(isValido: boolean ){
    if(isValido){
      this.htmlElement.nativeElement.classList.add('hidden');
    } else {
      this.htmlElement.nativeElement.classList.remove('hidden');
    }
  }

  constructor(
    private _el: ElementRef<HTMLElement>
  ) {
    this.htmlElement = _el;
   }
   ngOnInit(): void {
    this.setColor();
    this.setMensaje();
    this.setEstilo();
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  setEstilo = () => {
    this.htmlElement.nativeElement.classList.add('form-text');
  }

  setColor = () => {
    this.htmlElement.nativeElement.style.color = this._color;
  }
  setMensaje = (): void => {
    this.htmlElement.nativeElement.textContent = this._mensaje;
  }
}
