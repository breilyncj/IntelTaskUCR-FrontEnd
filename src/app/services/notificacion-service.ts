import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Notificacion} from '../models/notificacion.model';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private baseUrl = environment.apiUrl; // Ya configurado en environment.ts
  private apiUrl = `${this.baseUrl}/Notificaciones`; // Se construye a partir del baseUrl
  private apiUrlDos = `${this.baseUrl}`;
  constructor(private http: HttpClient) { }

  crearNotificacion(notificacion: Notificacion): Observable<any> {
    return this.http.post(this.apiUrl, notificacion);
  }

  getNotificacionesPorUsuarioYTipo(usuarioId: number, tipo: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/filtrar?usuarioId=${usuarioId}&tipoNotificacion=${tipo}`);
  }


}
