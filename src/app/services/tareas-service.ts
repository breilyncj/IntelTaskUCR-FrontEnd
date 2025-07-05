import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {complejidadTarea, Tarea, TareasCreate, estadoTarea} from '../models/tarea.model';
import {TareaConRelacionesVista} from '../models/tarea-con-relaciones-vista.model';
import {Adjunto} from '../models/adjunto.model';

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private baseUrl = environment.apiUrl; // Ya configurado en environment.ts
  private apiUrl = `${this.baseUrl}/Tareas`; // Se construye a partir del baseUrl
  private apiUrlDos = `${this.baseUrl}`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Tarea[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((rawTareas) =>
        rawTareas.map((t) => ({
          id: t.cN_Id_tarea,
          titulo: t.cT_Titulo_tarea,
          usuarioAsignado: t.cN_Usuario_asignado,
          usuarioCreador: t.usuarioCreador?.cT_Nombre_usuario ?? 'Sin usuario creador',
          usuarioCreadorId: t.usuarioCreador?.cN_Id_usuario ?? null,
          estado: t.cN_Id_estado,
          prioridad: t.cN_Id_prioridad,
          complejidad: t.cN_Id_complejidad,
          fechaLimite: t.cF_Fecha_limite,
          numeroGIS: t.cN_Numero_GIS,
        }))
      )
    );
  }

  getById(id: number): Observable<TareasCreate> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(t => ({
        cN_Id_tarea: t.cN_Id_tarea,
        cN_Tarea_origen: t.cN_Tarea_origen,
        cT_Titulo_tarea: t.cT_Titulo_tarea,
        cT_Descripcion_tarea: t.cT_Descripcion_tarea,
        cT_Descripcion_espera: t.cT_Descripcion_espera,
        cN_Id_complejidad: t.cN_Id_complejidad,
        cN_Id_estado: t.cN_Id_estado,
        cN_Id_prioridad: t.cN_Id_prioridad,
        cN_Numero_GIS: t.cN_Numero_GIS,
        cF_Fecha_asignacion: t.cF_Fecha_asignacion,
        cF_Fecha_limite: t.cF_Fecha_limite,
        cF_Fecha_finalizacion: t.cF_Fecha_finalizacion,
        cN_Usuario_creador: t.cN_Usuario_creador,
        cN_Usuario_asignado: t.cN_Usuario_asignado
      }))
    );
  }



  getAllWithRelaciones(): Observable<Tarea[]> {
    return this.http.get<any[]>(`${this.apiUrl}/withRelaciones`).pipe(
      map((rawTareas) =>
        rawTareas.map((t) => ({
          id: t.cN_Id_tarea,
          titulo: t.cT_Titulo_tarea,
          usuarioAsignado: t.usuarioAsignado?.cT_Nombre_usuario ?? 'Sin usuario asignado',
          usuarioCreador: t.usuarioCreador?.cT_Nombre_usuario ?? 'Sin usuario creador',
          usuarioCreadorId: t.usuarioCreador?.cN_Id_usuario ?? null,
          estado: t.estados?.cT_Estado ?? 'Sin estado',
          prioridad: t.prioridades?.cN_Id_prioridad ?? 0,
          nombrePrioridad: t.prioridades?.cT_Nombre_prioridad ?? 'Sin prioridad',
          complejidad: t.complejidades?.cT_Nombre ?? 'Sin complejidad',
          fechaLimite: t.cF_Fecha_limite,
          numeroGIS: t.cN_Numero_GIS,
        }))
      )
    );
  }

  getAllByIdUsuarioCreador(id: number): Observable<Tarea[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ByUsuarioCreador/${id}`).pipe(
      map((rawTareas) =>
        rawTareas.map((t) => ({
          id: t.cN_Id_tarea,
          titulo: t.cT_Titulo_tarea,
          usuarioAsignado: t.usuarioAsignado?.cT_Nombre_usuario ?? 'Sin usuario asignado',
          usuarioCreador: t.usuarioCreador?.cT_Nombre_usuario ?? 'Sin usuario creador',
          usuarioCreadorId: t.usuarioCreador?.cN_Id_usuario ?? null,
          estado: t.estados?.cT_Estado ?? 'Sin estado',
          prioridad: t.prioridades?.cT_Nombre_prioridad ?? 'Sin prioridad',
          nombrePrioridad: t.prioridades?.cT_Nombre_prioridad ?? 'Sin prioridad',
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
        tareaOrigen: t.cN_Tarea_origen,
        tareasSeguimiento: t.tareasSeguimiento?.map((ts: any) => ({
          idSeguimiento: ts.cN_Id_seguimiento,
          idTarea: ts.cN_Id_tarea,
          comentario: ts.cT_Comentario,
          fechaSeguimiento: ts.cF_Fecha_seguimiento
        })) ?? [],
        adjuntos: t.adjuntos?.map((a: any) => ({
          cN_Id_adjuntos: a.cN_Id_adjuntos,
          cT_Archivo_ruta: a.cT_Archivo_ruta,
          cN_Usuario_accion: a.cN_Usuario_accion,
          cF_Fecha_registro: a.cF_Fecha_registro,
          nombreArchivo: a.nombreArchivo
        })) ?? []
      }))
    );
  }

  updateEstadoTarea(id: number, nuevoEstado: string) {
    return this.http.put(`${this.baseUrl}/Tareas/${id}/estado`, nuevoEstado, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  crearTarea(tarea: TareasCreate): Observable<TareasCreate> {
    return this.http.post<TareasCreate>(this.apiUrl, tarea);
  }

  editarTarea(id: number, tarea: TareasCreate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, tarea);
  }

  getAllByIdUsuarioAsignado(id: number): Observable<Tarea[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ByUsuarioAsignado/${id}`).pipe(
      map((rawTareas) =>
        rawTareas.map((t) => ({
          id: t.cN_Id_tarea,
          titulo: t.cT_Titulo_tarea,
          usuarioAsignado: t.usuarioAsignado?.cT_Nombre_usuario ?? 'Sin usuario asignado',
          usuarioCreador: t.usuarioCreador?.cT_Nombre_usuario ?? 'Sin usuario creador',
          usuarioCreadorId: t.usuarioCreador?.cN_Id_usuario ?? null,
          estado: t.estados?.cT_Estado ?? 'Sin estado',
          prioridad: t.prioridades?.cT_Nombre_prioridad ?? 'Sin prioridad',
          nombrePrioridad: t.prioridades?.cT_Nombre_prioridad ?? 'Sin prioridad',
          complejidad: t.complejidades?.cT_Nombre ?? 'Sin complejidad',
          fechaLimite: t.cF_Fecha_limite,
          numeroGIS: t.cN_Numero_GIS,
        }))
      )
    );
  }

}
