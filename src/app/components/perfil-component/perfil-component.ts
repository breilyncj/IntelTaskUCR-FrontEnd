import {Component,  OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Perfil} from '../../models/perfil.model';
import { PerfilService } from '../../services/perfil-service';
import {LoginService} from '../../services/login-service';
import { NgClass, DatePipe } from '@angular/common';

@Component({
  selector: 'app-perfil-component',
  standalone: true,
  imports: [
    NgClass,
    DatePipe, CommonModule],
  templateUrl: './perfil-component.html',
  styleUrl: './perfil-component.css'
})
export class PerfilComponent implements OnInit{

  perfil: Perfil| null = null;
  loading = true;
  error = '';

  constructor(private loginService: LoginService){}

  roles = [
    { id: 1, nombre: 'Director (a)' },
    { id: 2, nombre: 'Subdirector (a)' },
    { id: 3, nombre: 'Jefe (a)' },
    { id: 4, nombre: 'Coordinador (a)' },
    { id: 5, nombre: 'Profesional 3' },
    { id: 6, nombre: 'Profesional 2' },
    { id: 7, nombre: 'Profesional 1' },
    { id: 8, nombre: 'Técnico' },
    { id: 9, nombre: 'Administrador (a)' }
  ];

  getRolNombre(id: number | undefined): string {
    const rol = this.roles.find(r => r.id === id);
    return rol ? rol.nombre : 'Desconocido';
  }

  // private getTareaConRelacionesPorId(id: number): void {
  //   this.perfilService.getUsuarioById(id).subscribe({
  //     next: (data) => {
  //       console.log(data);
  //       this.perfil = data;
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       this.error = 'Error al cargar la tarea con relaciones';
  //       this.loading = false;
  //     }
  //   });
  // }

  ngOnInit(): void {

    this.perfil = this.loginService.getUser();

  }


}
