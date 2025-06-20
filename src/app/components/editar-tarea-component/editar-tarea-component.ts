import {Component, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {UsuarioService} from '../../services/usuario-service';
import {TareasService} from '../../services/tareas-service';
import {LoginService} from '../../services/login-service';

@Component({
  selector: 'app-editar-tarea-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './editar-tarea-component.html',
  styleUrl: './editar-tarea-component.css'
})
export class EditarTareaComponent implements OnInit{

  form: FormGroup;
  usuarios: any[] = [];
  loading = true;
  error: string | null = null;
  prioridades: any[] = [];
  complejidades: any[] = [];
  asignarDeInmediato: boolean = true;
  usuarioDetalle: any | null = null;

  constructor(
    private fb: FormBuilder,
    private UsuarioService: UsuarioService,
    private tareasService: TareasService,
    private loginService: LoginService
  ) {
    this.form = this.fb.group({
      tareaOrigen: [null], // puede ser null
      tituloTarea: ['', Validators.required, Validators.minLength(3)], // puede ser null
      descripcionTarea: ['', Validators.required, Validators.minLength(5), Validators.maxLength(50)], // requerido
      descripcionEspera: [null], // puede ser null
      complejidad: [null, Validators.required], // requerido
      estado: [null], // requerido
      prioridad: [null, Validators.required], // requerido
      numeroGIS: ['', Validators.required, Validators.minLength(3)], // puede ser null
      fechaAsignacion: [null], // requerido
      fechaLimite: [null, Validators.required], // requerido
      fechaFinalizacion: [null, Validators.required], // requerido
      usuarioCreador: [null], // requerido
      usuarioAsignado: [null], // puede ser null
    });
  }

  public getUsuarios(): void {
    this.UsuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las tareas con relaciones';
        this.loading = false;
      }
    });
  }


  getPrioridades(): void {
    console.log('getPrioridades llamado');
    this.UsuarioService.getPrioridades().subscribe({
      next: data => {
        this.prioridades = data;
        console.log('Prioridades recibidas:', this.prioridades);
      },
      error: err => {
        console.error('Error al obtener prioridades:', err);
      }
    });
  }

  getComplejidades(): void {
    console.log('getComplejidades llamado');
    this.UsuarioService.getComplejidades().subscribe({
      next: data => {
        this.complejidades = data;
        console.log('Complejidades recibidas:', this.complejidades);
      },
      error: err => {
        console.error('Error al obtener complejidades:', err);
      }
    });
  }

  onAsignarSwitchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.asignarDeInmediato = input.checked;
  }

  abrirDetalleUsuario(usuario: any): void {
    const id = usuario.id_usuario;
    this.usuarioDetalle = null;

    console.log('Id del usuario:', id);
    this.UsuarioService.getDetalleUsuario(id).subscribe({
      next: (data) => {
        console.log('Detalle del usuario:', data);
        this.usuarioDetalle = data;
      },
      error: (error) => {
        console.error('Error al cargar detalle del usuario', error);
      }
    });
  }

  ngOnInit(): void {
    this.getUsuarios();
    this.getPrioridades();
    this.getComplejidades();
  }

}
