import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Tarea, TareasCreate} from '../models/tarea.model';
import {TareaConRelacionesVista} from '../models/tarea-con-relaciones-vista.model';

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
          usuarioAsignado: t.usuarioAsignado?.cT_Nombre_usuario ?? 'Sin usuario asignado',
          estado: t.estados?.cT_Estado ?? 'Sin estado',
          prioridad: t.prioridades?.cT_Nombre_prioridad ?? 'Sin prioridad',
          complejidad: t.complejidades?.cT_Nombre ?? 'Sin complejidad',
          fechaLimite: t.cF_Fecha_limite,
          numeroGIS: t.cN_Numero_GIS,
        }))
      )
    );
  }


  getTareaWithRelacionesById(id: number): Observable<TareaConRelacionesVista> {
    return this.http.get<any>(`${this.apiUrl}/WithRelaciones/${id}`).pipe(
      map((t) => ({
        id: t.cN_Id_tarea!,
        titulo: t.cT_Titulo_tarea ?? 'Sin título',
        usuarioAsignado: t.usuarioAsignado?.cT_Nombre_usuario ?? 'Sin asignación',
        usuarioCreador: t.usuarioCreador?.cT_Nombre_usuario ?? 'Desconocido',
        estado: t.estados?.cT_Estado ?? 'Desconocido',
        prioridad: t.prioridades?.cT_Nombre_prioridad ?? 'Desconocida',
        complejidad: t.complejidades?.cT_Nombre ?? 'Desconocida',
        descripcion: t.cT_Descripcion_tarea,
        descripcionEsperada: t.cT_Descripcion_espera ?? '',
        fechaAsignacion: t.cF_Fecha_asignacion,
        fechaLimite: t.cF_Fecha_limite,
        fechaFinalizacion: t.cF_Fecha_finalizacion,
        numeroGIS: t.cN_Numero_GIS ?? '',
        tareaOrigen: t.cN_Tarea_origen
      }))
    );
  }

  crearTarea(tarea: TareasCreate): Observable<TareasCreate> {
    return this.http.post<TareasCreate>(this.apiUrl, tarea);
  }



}
