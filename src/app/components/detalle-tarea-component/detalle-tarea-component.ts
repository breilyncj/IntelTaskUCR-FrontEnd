import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TareasService} from '../../services/tareas-service';
import {TareaConRelacionesVista} from '../../models/tarea-con-relaciones-vista.model';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import{ SidenavService } from '../../services/sidenav-service';

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

  constructor(
    private tareasService: TareasService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sidenavService: SidenavService
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
      },
      error: (error) => {
        this.error = 'Error al cargar la tarea con relaciones';
        this.loading = false;
      }
    });
  }

  private escucharSidenav() {
    this.sidenavService.collapsed$.subscribe((estado) => {
      this.sidenavExpandido = !estado;
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    console.log(id);
    this.getTareaConRelacionesPorId(id);
  }
}
