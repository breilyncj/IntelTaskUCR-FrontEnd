import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Tarea} from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private baseUrl = environment.apiUrl; // Ya configurado en environment.ts
  private apiUrl = `${this.baseUrl}/Tareas`; // Se construye a partir del baseUrl

  constructor(private http: HttpClient) { }

  getAll(): Observable<Tarea[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((rawTareas) =>
        rawTareas.map((t) => ({
          id: t.CN_Id_tarea,
          titulo: t.CT_Titulo_tarea,
          usuarioAsignado: t.CN_Usuario_asignado,  // <-- solo es el ID
          estado: t.CN_Id_estado,                  // <-- solo es el ID
          prioridad: t.CN_Id_prioridad,
          complejidad: t.CN_Id_complejidad,
          fechaLimite: t.CF_Fecha_limite,
          numeroGIS: t.CN_Numero_GIS
        }))
      )
    );
  }
}
