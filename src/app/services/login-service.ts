import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Login} from '../models/login.model';
import {map, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Usuario} from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/Auth/Login`;

  private readonly USER_KEY = 'auth_user';

  constructor(private router: Router, private http: HttpClient) {}

  login(usuario: Usuario) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }

  getUser(): any | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  hasRole(rolesPermitidos: number[]): boolean {
    const usuario = this.getUser();
    console.log("has role");
    console.log(usuario);
    return usuario ? rolesPermitidos.includes(usuario.cN_Id_rol) : false;
  }

  autenticar(login: Login): Observable<any> {
    return this.http.post<any>(this.apiUrl, login);
  }

  getUserCorreo(): string | null {
    const user = this.getUser();
    return user?.cT_Correo_usuario ?? null;
  }

}
