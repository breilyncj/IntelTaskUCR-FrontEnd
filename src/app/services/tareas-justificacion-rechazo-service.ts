import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {TareasJustificacionRechazo} from '../models/tareas-justificacion-rechazo.model';


@Injectable({
  providedIn: 'root'
})
export class TareasJustificacionRechazoService {

  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/TareasJustificacionRechazo`;

  constructor(private http: HttpClient) { }
}
