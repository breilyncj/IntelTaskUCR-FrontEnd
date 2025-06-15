import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Tarea} from '../models/tarea.model';
import {map, Observable} from 'rxjs';
import {TareaConRelacionesVista} from '../models/tarea-con-relaciones-vista.model';


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


  getTareasAsignadasPorMiById(id: number): Observable<Tarea[]> {
    return this.http.get<any>(`${this.apiUrl}/WithTareasAsignadas/${id}`).pipe(
      map((usuario) => {
        const tareasRaw = usuario.tareasUsuarioAsignado ?? [];
        return tareasRaw.map((t: any) => ({
          id: t.cN_Id_tarea,
          titulo: t.cT_Titulo_tarea,
          usuarioAsignado: t.usuarioAsignado?.cT_Nombre_usuario ?? 'Sin usuario asignado',
          estado: t.estados?.cT_Estado ?? 'Sin estado',
          prioridad: t.prioridades?.cT_Nombre_prioridad ?? 'Sin prioridad',
          complejidad: t.complejidades?.cT_Nombre ?? 'Sin complejidad',
          fechaLimite: t.cF_Fecha_limite,
          numeroGIS: t.cN_Numero_GIS,
        }));
      })
    );
  }

  getTareasAsignadasAMiById(id: number): Observable<Tarea[]> {
    return this.http.get<any>(`${this.apiUrl}/WithTareasCreador/${id}`).pipe(
      map((usuario) => {
        const tareasRaw = usuario.tareasUsuarioCreado?? [];
        return tareasRaw.map((t: any) => ({
          id: t.cN_Id_tarea,
          titulo: t.cT_Titulo_tarea,
          usuarioAsignado: t.usuarioAsignado?.cT_Nombre_usuario ?? 'Sin usuario asignado',
          estado: t.estados?.cT_Estado ?? 'Sin estado',
          prioridad: t.prioridades?.cT_Nombre_prioridad ?? 'Sin prioridad',
          complejidad: t.complejidades?.cT_Nombre ?? 'Sin complejidad',
          fechaLimite: t.cF_Fecha_limite,
          numeroGIS: t.cN_Numero_GIS,
        }));
      })
    );
  }



}
