import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {UsuarioService} from '../../services/usuario-service';
import {Notificacion} from '../../models/notificacion.model';
import {LoginService} from '../../services/login-service';
import {NotificacionService} from '../../services/notificacion-service';
import { Router } from '@angular/router';
import {UsuarioAsignado} from '../../models/usuario.model';
import Swal from 'sweetalert2';

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

  notificacionesFiltradas: Notificacion[] = [];
  filtroEstado: string = '';
  filtroOtroEstado: string = '';
  titulo = '';
  mensaje = '';
  tipoNotificacionSeleccionado = 1; // Por defecto inmediata
  esProgramada = false; // Si quieres usar programación
  fechaProgramada: string | null = null; // ISO string de fecha/hora programada
  idRecordatorioSeleccionado: number | null = null;
  horaProgramada: string | null = null;
  usuarios: UsuarioAsignado[] = [];
  usuariosSeleccionados: UsuarioAsignado[] = [];
  loading = true;
  error: string | null = null;
  mostrarSelector: boolean = false;

  usuariosSeleccionadosProgramar: UsuarioAsignado[] = [];
  mostrarSelectorProgramar = false;

  notificacionesEnviadas: Notificacion[] = [];
  notificacionesProgramadas: Notificacion[] = [];


  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private notificacionService: NotificacionService,
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

  cargarNotificacionesEnviadas() {
    const usuarioId = this.loginService.getUser()?.cN_Id_usuario ?? null;
    this.esProgramada = false;
    if (!usuarioId) return;

    this.notificacionService.getNotificacionesPorUsuarioYTipo(usuarioId, 1).subscribe({
      next: data => this.notificacionesEnviadas = data,
      error: err => {
        console.error(err);
        this.notificacionesEnviadas = [];
      }
    });
  }

  cargarNotificacionesProgramadas() {
    const usuarioId = this.loginService.getUser()?.cN_Id_usuario ?? null;
    if (!usuarioId) return;

    this.notificacionService.getNotificacionesPorUsuarioYTipo(usuarioId, 2).subscribe({
      next: data => this.notificacionesProgramadas = data,
      error: err => {
        console.error(err);
        this.notificacionesProgramadas = [];
      }
    });
  }


  public getUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (data: UsuarioAsignado[]) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los usuarios';
        this.loading = false;
      }
    });
  }

  toggleSeleccionUsuario(user: UsuarioAsignado): void {
    if (this.usuarioYaSeleccionado(user)) {
      this.usuariosSeleccionados = this.usuariosSeleccionados.filter(u => u.id_usuario !== user.id_usuario);
      this.usuariosSeleccionadosProgramar = this.usuariosSeleccionadosProgramar.filter(u => u.id_usuario !== user.id_usuario);
    } else {
      this.usuariosSeleccionados.push(user);
      this.usuariosSeleccionadosProgramar.push(user);
    }
  }

  usuarioYaSeleccionado(user: UsuarioAsignado): boolean {
    return this.usuariosSeleccionados.some(u => u.id_usuario === user.id_usuario);

  }

  quitarUsuario(user: UsuarioAsignado): void {
    this.usuariosSeleccionados = this.usuariosSeleccionados.filter(u => u.id_usuario !== user.id_usuario);
  }

  get usuariosNombresConcatenados(): string {
    return this.usuariosSeleccionados.map(u => u.nombre_usuario).join(', ');
  }

  formatLocalDateTime(date: Date): string {
    const año = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    const hora = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const seg = String(date.getSeconds()).padStart(2, '0');
    return `${año}-${mes}-${dia} ${hora}:${min}:${seg}`;
  }


  crearNotificacion() {

    const user = this.loginService.getUser();
    const now = new Date();  // ya tiene hora local correcta
    let fechaNotificacion: Date;

    if (this.tipoNotificacionSeleccionado === 2 && this.fechaProgramada && this.horaProgramada) {
      fechaNotificacion = new Date(`${this.fechaProgramada}T${this.horaProgramada}:00`);
    } else {
      fechaNotificacion = now;
    }

    const notificacion: Notificacion = {
      cN_Tipo_notificacion: this.tipoNotificacionSeleccionado,
      cT_Titulo_notificacion: this.titulo,
      cT_Texto_notificacion: this.mensaje,
      cT_Correo_origen: user?.cT_Correo_usuario ?? '',
      cF_Fecha_registro: now,
      cF_Fecha_notificacion: fechaNotificacion,
      cN_Id_recordatorio: this.idRecordatorioSeleccionado || null,
      notificacionesXUsuarios: this.usuariosSeleccionados.map(u => ({
        cN_Id_usuario: u.id_usuario,
        cT_Correo_destino: u.correo_usuario
      }))
    };

    this.notificacionService.crearNotificacion(notificacion).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Notificación creada correctamente', 'success');
        this.limpiarCampos();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo crear la notificación', 'error');
      }
    });
  }



  limpiarCampos(): void {
    this.titulo = '';
    this.mensaje = '';
    this.tipoNotificacionSeleccionado = 1;
    this.esProgramada = false;
    this.fechaProgramada = null;
    this.idRecordatorioSeleccionado = null;
    this.horaProgramada = null;
    this.usuariosSeleccionados = [];
    this.usuariosSeleccionadosProgramar = [];
  }


  ngOnInit(): void {
    this.filtrar();
    this.getUsuarios();
    this.cargarNotificacionesEnviadas();
    this.cargarNotificacionesProgramadas();
  }
}
