import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TareasService} from '../../services/tareas-service';
import {Tarea, TareasCreate} from '../../models/tarea.model';
import { SidenavService } from '../../services/sidenav-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {RouterModule} from '@angular/router';


@Component({
  selector: 'app-tareas-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tareas-component.html',
  styleUrl: './tareas-component.css'
})
export class TareasComponent implements OnInit{
  tareas: Tarea[] = [];
  loading = true;
  error: string | null = null;
  sidenavExpandido: boolean = true;
  form: FormGroup;


  constructor(
    private fb: FormBuilder,
    private tareasService: TareasService,
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


  private getAll() : void{
    this.tareasService.getAll().subscribe({
      next: (data) => {
        this.tareas = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las tareas'
        this.loading = false;
      }
    });
  }

  private getAllWithRelaciones(): void {
    this.tareasService.getAllWithRelaciones().subscribe({
      next: (data) => {
        this.tareas = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las tareas con relaciones';
        this.loading = false;
      }
    });
  }

  public mapFormToTareaCreate(formValue: any): TareasCreate {
    return {
      cN_Tarea_origen: formValue.tareaOrigen,
      cT_Titulo_tarea: formValue.tituloTarea,
      cT_Descripcion_tarea: formValue.descripcionTarea,
      cT_Descripcion_espera: formValue.descripcionEspera,
      cN_Id_complejidad: formValue.complejidad,
      cN_Id_estado: formValue.estado,
      cN_Id_prioridad: formValue.prioridad,
      cN_Numero_GIS: formValue.numeroGIS,
      cF_Fecha_asignacion: formValue.fechaAsignacion,
      cF_Fecha_limite: formValue.fechaLimite,
      cF_Fecha_finalizacion: formValue.fechaFinalizacion,
      cN_Usuario_creador: formValue.usuarioCreador,
      cN_Usuario_asignado: formValue.usuarioAsignado,
    };
  }


  public crearTarea(){

    console.log(this.form.value);
    this.tareasService.crearTarea(this.mapFormToTareaCreate(this.form.value)).subscribe({
      next: (nuevaTarea) => {
        console.log('Tarea creada:', nuevaTarea);
        console.log('Id asignado:', nuevaTarea.cN_Id_tarea);
      },
      error: (err) => {
        console.error('Error al crear tarea:', err);
      },

    });
  }

  private escucharSidenav() {
    this.sidenavService.collapsed$.subscribe((estado) => {
      this.sidenavExpandido = !estado;
    });
  }

  ngOnInit(): void {

    this.getAllWithRelaciones();
    this.escucharSidenav();
  }


}
