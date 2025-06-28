import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TareasService} from '../../services/tareas-service';
import {TareaConRelacionesVista} from '../../models/tarea-con-relaciones-vista.model';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import{ SidenavService } from '../../services/sidenav-service';
import{ EstadoService} from '../../services/estado-service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detalle-tarea-component',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detalle-tarea-component.html',
  styleUrl: './detalle-tarea-component.css'
})
export class DetalleTareaComponent implements OnInit {
  tareaConRelaciones: TareaConRelacionesVista | null = null;
  sidenavExpandido: boolean = true;
  loading = true;
  error = '';
  form: FormGroup;
  tareaPadre: TareaConRelacionesVista | null = null;

  constructor(
    private tareasService: TareasService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sidenavService: SidenavService,
    private estadoService: EstadoService
  ) {
  this.form = this.fb.group({
    tareaOrigen: [null], // puede ser null
    tituloTarea: [null], // puede ser null
    descripcionTarea: ['', Validators.required], // requerido
    descripcionEspera: [null], // puede ser null
    complejidad: [null, Validators.required], // requerido
    estado: [null, Validators.required], // requerido
    prioridad: [null, Validators.required], // requerido
    numeroGIS: [null], // puede ser null
    fechaAsignacion: [null, Validators.required], // requerido
    fechaLimite: [null, Validators.required], // requerido
    fechaFinalizacion: [null, Validators.required], // requerido
    usuarioCreador: [null, Validators.required], // requerido
    usuarioAsignado: [null] // puede ser null
  });
}

  private getTareaConRelacionesPorId(id: number): void {
    this.tareasService.getTareaWithRelacionesById(id).subscribe({
      next: (data) => {
        this.tareaConRelaciones = data;
        this.loading = false;

        // Verifica si tiene tarea padre:
        if (this.tareaConRelaciones?.tareaOrigen) {
          this.getTareaPadre(this.tareaConRelaciones.tareaOrigen);
        } else {
          console.log('Esta tarea no tiene tarea origen.');
        }
      },
      error: (error) => {
        this.error = 'Error al cargar la tarea con relaciones';
        this.loading = false;
      }
    });
  }

  getTareaPadre(id: number): void {
    this.tareasService.getTareaWithRelacionesById(id).subscribe({
      next: (data) => {
        console.log('Papá:', data);
        this.tareaPadre = data;
      },
      error: (err) => {
        console.error('Error al cargar tarea padre:', err);
      }
    });
  }


  irEditarTarea(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.router.navigate(['/editarTarea', id]);
  }

  toggleEstado() {
    if (!this.tareaConRelaciones) return;

    const tareaId = this.tareaConRelaciones.id;

    // Verifica estado actual:
    const estadoActual = this.tareaConRelaciones.estado;

    let nuevoEstadoId: number;
    if (estadoActual === 'Inactivo') {
      nuevoEstadoId = 8; // Activar
    } else {
      nuevoEstadoId = 9; // Desactivar
    }

    this.tareasService.updateEstadoTarea(tareaId, nuevoEstadoId.toString()).subscribe({
      next: () => {
        Swal.fire('Éxito', `La tarea se ha ${nuevoEstadoId === 8 ? 'activado' : 'desactivado'} correctamente.`, 'success');

        // Actualiza el dato local:
        this.tareaConRelaciones!.estado = nuevoEstadoId === 8 ? 'Activo' : 'Inactivo';
        this.getTareaConRelacionesPorId(tareaId);
      },
      error: (err) => {
        console.error('Error:', err);
        Swal.fire('Error', 'No se pudo cambiar el estado.', 'error');
      }
    });
  }


  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    console.log(id);
    this.getTareaConRelacionesPorId(id);
  }
}
