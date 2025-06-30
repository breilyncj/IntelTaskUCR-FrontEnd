import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {UsuarioService} from '../../services/usuario-service';
import {Notificacion} from '../../models/notificacion.model';
import {LoginService} from '../../services/login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificacion-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule, ReactiveFormsModule, RouterModule, FormsModule
  ],
  templateUrl: './notificacion-component.html',
  styleUrl: './notificacion-component.css'
})
export class NotificacionComponent implements OnInit {

  notificacionesEnviadas: Notificacion[] = [];
  notificacionesFiltradas: Notificacion[] = [];
  filtroEstado: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private router: Router
  ) {}

  filtrar(): void {
    const user = this.loginService.getUser();
    const idUsuario = this.loginService.getUser()?.cN_Id_usuario ?? null;
    const correo = user?.cT_Correo_usuario ?? null;

    if (this.filtroEstado === 'EnviadosPorMi') {
      if (!correo) {
        console.error('No se encontró el correo del usuario.');
        this.notificacionesFiltradas = [];
        return;
      }
      this.usuarioService.getNotificacionesEnviadasPor(correo).subscribe({
        next: data => this.notificacionesFiltradas = data,
        error: err => {
          console.error(err);
          this.notificacionesFiltradas = [];
        }
      });
    } else if (this.filtroEstado === 'Recibidos') {
      if (!idUsuario) {
        console.error('No se encontró el ID del usuario.');
        this.notificacionesFiltradas = [];
        return;
      }
      this.usuarioService.getNotificacionesRecibidasPor(idUsuario).subscribe({
        next: data => this.notificacionesFiltradas = data,
        error: err => {
          console.error(err);
          this.notificacionesFiltradas = [];
        }
      });
    } else {
      // Sin filtro, carga todas
      if (!idUsuario) {
        console.error('No se encontró el ID del usuario.');
        this.notificacionesFiltradas = [];
        return;
      }
      this.usuarioService.getNotificacionesDeUsuario(idUsuario).subscribe({
        next: data => this.notificacionesFiltradas = data,
        error: err => {
          console.error(err);
          this.notificacionesFiltradas = [];
        }
      });
    }
  }


  ngOnInit(): void {
    this.filtrar();
  }
}
