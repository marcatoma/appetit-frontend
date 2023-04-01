import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Restaurant } from 'src/app/models/restaurant/restaurant';
import { BASE_URL } from 'src/environments/configurations';

//swalservice
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  url: string = BASE_URL;
  constructor(private http: HttpClient) {}

  obtenerDatosRestaurant(): Observable<Restaurant> {
    return this.http.get<Restaurant>(this.url + 'get/restautant/data').pipe(
      map((response: any) => response.restaurante as Restaurant),
      catchError((e) => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  actualizarDataRestaurant(res: Restaurant): Observable<any> {
    return this.http.post(this.url + 'register/restaurant/data', res).pipe(
      map((response: any) => response.mensaje),
      catchError((e) => {
        if (e.status === 409) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }
}
