import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Estado} from '../models/estado.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private baseUrl = environment.apiUrl; // Ya configurado en environment.ts
  private apiUrl = `${this.baseUrl}/Estados`; // Se construye a partir del baseUrl

  constructor(private http: HttpClient) { }

  getAll(): Observable<Estado[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((rawEstados) =>
        rawEstados.map((e) => ({
          id: e.cN_Id_estado,
          estado: e.cT_Estado,
          descripcion: e.cT_Descripcion,
        }))
      )
    );
  }
}
