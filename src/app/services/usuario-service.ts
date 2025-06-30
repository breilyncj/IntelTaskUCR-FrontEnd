import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Tarea} from '../models/tarea.model';
import {map, Observable} from 'rxjs';
import {TareaConRelacionesVista} from '../models/tarea-con-relaciones-vista.model';
import {UsuarioAsignado} from '../models/usuario.model';
import {TareaDetalle, UsuarioConDetalle} from '../models/usuario.model';
import {prioridadTarea, complejidadTarea} from '../models/tarea.model';
import {Notificacion} from '../models/notificacion.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = environment.apiUrl; // Ya configurado en environment.ts
  private apiUrl = `${this.baseUrl}/Usuarios`; // Se construye a partir del baseUrl
  private apiUrlDos = `${this.baseUrl}`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<UsuarioAsignado[]> {
    return this.http.get<any[]>(`${this.apiUrl}/withRelaciones`).pipe(
      map((usuarios) =>
        usuarios.map((u) => {

          const tareas = u.tareasUsuarioAsignado ?? [];
          console.log(tareas);
          return {
            id_usuario: u.cN_Id_usuario,
            nombre_usuario: u.cT_Nombre_usuario,
            correo_usuario: u.cT_Correo_usuario,
            cantidadTareasAsignadas: tareas.length
          };
        })
      )
    );
  }

  getDetalleUsuario(id: number): Observable<UsuarioConDetalle> {
    return this.http.get<any>(`${this.apiUrl}/WithTareasAsignadas/${id}`).pipe(
      map(u => ({
        cN_Id_usuario: u.cN_Id_usuario,
        cT_Nombre_usuario: u.cT_Nombre_usuario,
        cT_Correo_usuario: u.cT_Correo_usuario,
        cN_Id_rol: u.cN_Id_rol,
        tareasUsuarioAsignado: (u.tareasUsuarioAsignado ?? []).map((t: any) => ({
          cN_Id_tarea: t.cN_Id_tarea,
          cT_Titulo_tarea: t.cT_Titulo_tarea,
          cN_Id_estado: t.cN_Id_estado,
          cF_Fecha_limite: t.cF_Fecha_limite,
          cN_Id_prioridad: t.cN_Id_prioridad
        }))
      }))
    );
  }

  getPrioridades(): Observable<prioridadTarea[]> {
    return this.http.get<any[]>(`${this.apiUrlDos}/prioridades`).pipe(
      map(data =>
        data.map(p => ({
          cN_Id_prioridad: p.cN_Id_prioridad,
          cT_Nombre_prioridad: p.cT_Nombre_prioridad
        }))
      )
    );
  }


  getComplejidades(): Observable<complejidadTarea[]> {
    return this.http.get<any[]>(`${this.apiUrlDos}/Complejidades`).pipe(
      map(data =>
        data.map(c => ({
          cN_Id_complejidad: c.cN_Id_complejidad,
          cT_Nombre: c.cT_Nombre
        }))
      )
    );
  }

  getNotificacionesDeUsuario(idUsuario: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/GetNotificacionesDeUsuario/${idUsuario}`);
  }

  getNotificacionesEnviadasPor(correo: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/GetNotificacionesEnviadasPor/${correo}`);
  }

  getNotificacionesRecibidasPor(idUsuario: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/GetNotificacionesRecibidasPor/${idUsuario}`);
  }

}
