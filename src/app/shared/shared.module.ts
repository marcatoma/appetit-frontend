import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ngBoostrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SideBarComponent } from './side-bar/side-bar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';


@NgModule({
  declarations: [SideBarComponent, FooterComponent, HeaderComponent, BreadcrumbsComponent],
  exports: [
    SideBarComponent,
    FooterComponent,
    HeaderComponent,
    BreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ]
})
export class SharedModule { }
