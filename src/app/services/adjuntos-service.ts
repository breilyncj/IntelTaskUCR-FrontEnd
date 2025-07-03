import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdjuntosService {

  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/Adjuntos`;

  constructor(private http: HttpClient) { }

  subirAdjunto(formData: FormData, idTarea: number, idUsuario: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/SubirAdjunto?idTarea=${idTarea}&idUsuario=${idUsuario}`, formData, {
      responseType: 'text'
    });
  }

}

