import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Perfil} from '../models/perfil.model';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private baseUrl = environment.apiUrl; // Ya configurado en environment.ts
  private apiUrl = `${this.baseUrl}/Usuarios`;

  constructor(private http: HttpClient) { }

  getUsuarioById(id: number): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/${id}`);
  }

}
