import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginService} from '../../services/login-service';
import {TareasService} from '../../services/tareas-service';
import {Tarea} from '../../models/tarea.model';
import {UsuarioService} from '../../services/usuario-service';
import {Notificacion} from '../../models/notificacion.model';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent implements OnInit{

  nombreUsuario: string | null = null;
  pendingTasksCount: number = 0;
  createdTasksCount: number = 0;
  activePermissionsCount: number = 0;
  notificationsCount: number = 0;

  constructor(
    private loginService: LoginService,
    private tareasService: TareasService,
    private usuarioService: UsuarioService,
  ) {}

  loadTaskStatistics(userId: number): void {
    this.tareasService.getAllByIdUsuarioCreador(userId).subscribe((tareas: Tarea[]) => {
      // Filtrar las tareas creadas
      this.createdTasksCount = tareas.length;

      // Filtrar las tareas pendientes
      this.pendingTasksCount = tareas.filter(t => t.estado === 'En espera').length;


      this.activePermissionsCount = tareas.filter(t => t.estado === 'Finalizada').length;
    });

    this.usuarioService.getNotificacionesRecibidasPor(userId).subscribe((notificaciones: Notificacion[]) => {
      this.notificationsCount = notificaciones.length;
    });
  }

  ngOnInit(): void {
    const usuario = this.loginService.getUser();
    this.nombreUsuario = usuario?.cT_Nombre_usuario || 'Usuario';

    if (usuario) {
      this.loadTaskStatistics(usuario.cN_Id_usuario);
    }
  }
}
