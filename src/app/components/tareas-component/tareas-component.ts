import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TareasService} from '../../services/tareas-service';
import {Tarea} from '../../models/tarea.model';
import { SidenavService } from '../../services/sidenav-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-tareas-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tareas-component.html',
  styleUrl: './tareas-component.css'
})
export class TareasComponent implements OnInit{
  tareas: Tarea[] = [];
  loading = true;
  error: string | null = null;
  sidenavExpandido: boolean = true;


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


  form: FormGroup;

  private getAll() : void{
    this.tareasService.getAll().subscribe({
      next: (data) => {
        this.tareas = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'error al cargar los estados'
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

  public crearTarea(){

    console.log(this.form.value);
    this.tareasService.crearTarea(this.form.value).subscribe({
      next: (nuevaTarea) => {
        console.log('Tarea creada:', nuevaTarea);
        console.log('Id asignado:', nuevaTarea.idtarea);
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
    this.getAll();
    this.getAllWithRelaciones();
    this.escucharSidenav();
  }


}
