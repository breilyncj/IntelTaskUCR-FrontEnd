import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Estado} from '../models/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private apiUrl = 'https://localhost:44306/api/Estados';

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
