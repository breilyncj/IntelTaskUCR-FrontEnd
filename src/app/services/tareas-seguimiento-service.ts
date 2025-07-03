import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {TareasSeguimiento} from '../models/tareas-seguimiento.model';

@Injectable({
  providedIn: 'root'
})
export class TareasSeguimientoService {

  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/TareasSeguimiento`;

  constructor(private http: HttpClient) { }

  crearSeguimiento(tarea: TareasSeguimiento): Observable<TareasSeguimiento> {
    return this.http.post<TareasSeguimiento>(this.apiUrl, tarea);
  }

}
