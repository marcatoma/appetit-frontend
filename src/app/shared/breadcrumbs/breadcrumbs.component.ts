import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css'],
})
export class BreadcrumbsComponent implements OnInit {
  title: string;
  subTitle: string;
  titleSub$: Subscription;
  constructor(private router: Router) {
    this.getPathArguments();
  }

  ngOnInit(): void {}

  // metodo para extarer lada que amdamops por el pages.routing, usamos filtros para filtrar la informacion necesaria
  getPathArguments(): void {
    this.titleSub$ = this.router.events
      .pipe(
        filter((event) => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      )
      .subscribe(({ title, subTitle }) => {
        (this.title = title), (this.subTitle = subTitle);
        document.title = `Restaurant - ${this.title} `;
      });
  }
}
