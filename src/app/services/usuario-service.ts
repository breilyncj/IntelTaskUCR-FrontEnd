import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Tarea} from '../models/tarea.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = environment.apiUrl; // Ya configurado en environment.ts
  private apiUrl = `${this.baseUrl}/Usuarios`; // Se construye a partir del baseUrl


  constructor(private http: HttpClient) { }

  getTareasbyUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/WithTareasAsignadas/${id}`);
  }
}
