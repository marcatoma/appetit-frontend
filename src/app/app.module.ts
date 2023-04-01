import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modulos creados
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';

//importacion de conexion http
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CategoriaService } from './services/categoria/categoria.service';

//deploy config
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';

//qr code
import { QRCodeModule } from 'angularx-qrcode';

// interceptors
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    PagesModule,
    AuthModule,
    NgbModule,
    QRCodeModule,
  ],
  exports: [QRCodeModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    CategoriaService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
