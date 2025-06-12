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
          id: t.cN_Id_tarea,
          titulo: t.cT_Titulo_tarea,
          usuarioAsignado: t.cN_Usuario_asignado,
          estado: t.cN_Id_estado,
          prioridad: t.cN_Id_prioridad,
          complejidad: t.cN_Id_complejidad,
          fechaLimite: t.cF_Fecha_limite,
          numeroGIS: t.cN_Numero_GIS,
        }))
      )
    );
  }

  getAllWithRelaciones(): Observable<Tarea[]> {
    return this.http.get<any[]>(`${this.apiUrl}/withRelaciones`).pipe(
      map((rawTareas) =>
        rawTareas.map((t) => ({
          id: t.cN_Id_tarea,
          titulo: t.cT_Titulo_tarea,
          usuarioAsignado: t.usuarios?.cT_Nombre_usuario ?? 'Sin usuario asignado',
          estado: t.estados?.cT_Estado ?? 'Sin estado',
          prioridad: t.prioridades?.cT_Nombre_prioridad ?? 'Sin prioridad',
          complejidad: t.complejidades?.cT_Nombre ?? 'Sin complejidad',
          fechaLimite: t.cF_Fecha_limite,
          numeroGIS: t.cN_Numero_GIS,
        }))
      )
    );
  }



}
