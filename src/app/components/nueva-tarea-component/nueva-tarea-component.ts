import {Component, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UsuarioService} from '../../services/usuario-service';
import {RouterModule, Router, ActivatedRoute} from '@angular/router';
import {TareasService} from '../../services/tareas-service';
import {LoginService} from '../../services/login-service';
import {TareasCreate} from '../../models/tarea.model';
import {TareaConRelacionesVista} from '../../models/tarea-con-relaciones-vista.model';

import { AfterViewInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-nueva-tarea-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './nueva-tarea-component.html',
  styleUrl: './nueva-tarea-component.css'
})
export class NuevaTareaComponent implements OnInit{
  form: FormGroup;
  asignarDeInmediato: boolean = true;
  usuarioDetalle: any | null = null;
  loading = true;
  error: string | null = null;
  usuarios: any[] = [];
  prioridades: any[] = [];
  complejidades: any[] = [];
  tareaPadreId: number | null = null;
  titulo: string = '';
  tareaPadre: TareaConRelacionesVista | null = null;


  constructor(
    private fb: FormBuilder,
    private UsuarioService: UsuarioService,
    private tareasService: TareasService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
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

  onAsignarSwitchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.asignarDeInmediato = input.checked;
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

  trackByUsuarioId(index: number, item: any): number {
    return item.id_usuario;
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
  resetFormulario(): void {
    this.form.reset({
      tareaOrigen: null,
      tituloTarea: '',
      descripcionTarea: '',
      descripcionEspera: null,
      complejidad: null,
      estado: null,
      prioridad: null,
      numeroGIS: '',
      fechaAsignacion: null,
      fechaLimite: null,
      fechaFinalizacion: null,
      usuarioCreador: null,
      usuarioAsignado: null
    });

    this.asignarDeInmediato = true;
  }

  asignacion(){
    if(this.tareaPadreId !== null){
      this.crearTareaHija();
    } else{
      this.crearTarea()
    }
  }

  getTitulo(): string {
    const id = this.route.snapshot.paramMap.get('id');
    return this.titulo = id ? 'Crear subtarea' : 'Nueva tarea';
  }


  crearTareaHija(): void {
    const idTareaOrigen = Number(this.route.snapshot.params['id']);
    const formValue = this.form.value;

    const fechaAsignacion = new Date();

    const fechaLimiteDate = new Date(formValue.fechaLimite);
    const fechaFinalizacionDate = new Date(formValue.fechaFinalizacion);

    const usuario = this.loginService.getUser();
    const usuarioCreadorId = usuario?.id || usuario?.cN_Id_usuario;  // según la propiedad que tenga el id

    const usuarioAsignado = formValue.usuarioAsignado !== undefined && formValue.usuarioAsignado !== null
      ? Number(formValue.usuarioAsignado)
      : null;

    const estadoId = usuarioAsignado ? 2 : 1;

    const subTarea: TareasCreate = {
      cN_Tarea_origen: idTareaOrigen,
      cT_Titulo_tarea: formValue.tituloTarea,
      cT_Descripcion_tarea: formValue.descripcionTarea,
      cT_Descripcion_espera: null,
      cN_Id_complejidad: Number(formValue.complejidad),
      cN_Id_estado: estadoId,
      cN_Id_prioridad:  Number(formValue.prioridad),
      cN_Numero_GIS: formValue.numeroGIS,
      cF_Fecha_asignacion: fechaAsignacion,
      cF_Fecha_limite: fechaLimiteDate,
      cF_Fecha_finalizacion: fechaFinalizacionDate,
      cN_Usuario_creador: usuarioCreadorId,
      cN_Usuario_asignado: usuarioAsignado
    };

    this.tareasService.crearTarea(subTarea).subscribe({
      next: (respuesta) => {
        console.log('Tarea hija creada correctamente', respuesta);
        Swal.fire('Éxito', 'Subtarea creada correctamente', 'success');
        setTimeout(() => {
          this.router.navigate(['/tareas']);
        }, 1500);
        this.resetFormulario();
      },
      error: (error) => {
        console.error('Error al crear tarea hija', error);
      }
    });

  }

  crearTarea() {
    const formValue = this.form.value;

    // Fecha actual (fecha + hora)
    const fechaAsignacion = new Date();

    const fechaLimiteDate = new Date(formValue.fechaLimite);
    const fechaFinalizacionDate = new Date(formValue.fechaFinalizacion);

    const usuario = this.loginService.getUser();
    const usuarioCreadorId = usuario?.id || usuario?.cN_Id_usuario;  // según la propiedad que tenga el id


    const usuarioAsignado = formValue.usuarioAsignado !== undefined && formValue.usuarioAsignado !== null
      ? Number(formValue.usuarioAsignado)
      : null;

    const estadoId = usuarioAsignado ? 2 : 1;

    const nuevaTarea: TareasCreate = {
      cN_Tarea_origen: null,
      cT_Titulo_tarea: formValue.tituloTarea,
      cT_Descripcion_tarea: formValue.descripcionTarea,
      cT_Descripcion_espera: null,
      cN_Id_complejidad: Number(formValue.complejidad),
      cN_Id_estado: estadoId,
      cN_Id_prioridad:  Number(formValue.prioridad),
      cN_Numero_GIS: formValue.numeroGIS,
      cF_Fecha_asignacion: fechaAsignacion,
      cF_Fecha_limite: fechaLimiteDate,
      cF_Fecha_finalizacion: fechaFinalizacionDate,
      cN_Usuario_creador: usuarioCreadorId,
      cN_Usuario_asignado: usuarioAsignado
    };

    this.tareasService.crearTarea(nuevaTarea).subscribe({
      next: (respuesta) => {
        console.log('Tarea creada correctamente', respuesta);
        const modalExito = new bootstrap.Modal(document.getElementById('modalExito')!);
        modalExito.show();
        this.resetFormulario();
      },
      error: (error) => {
        console.error('Error al crear tarea', error);
      }
    });
  }

  get minFecha(): string {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.getUsuarios();
    this.getPrioridades();
    this.getComplejidades();
    const id = this.route.snapshot.paramMap.get('id');
    this.tareaPadreId = id ? +id : null;
    this.getTareasPadre();
    this.getTitulo();
  }


  get maxFechaPadre(): string | undefined {
    if (this.tareaPadre) {
      return new Date(this.tareaPadre.fechaLimite).toISOString().slice(0, 16);
    }
    return undefined; // NO null
  }

  get maxFechaFinalPadre(): string | null {
    if (this.tareaPadre) {
      return new Date(this.tareaPadre.fechaFinalizacion).toISOString().slice(0, 16);
    }
    return null; // Si NO hay tarea padre, no hay límite superior
  }

  getTareasPadre(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id !== null){
      this.tareasService.getTareaWithRelacionesById(Number(id)).subscribe({
        next: (data) => {
          console.log('Papá:', data);
          this.tareaPadre = data;
        },
        error: (err) => {
          console.error('Error al cargar tarea padre:', err);
        }
      })
    }
  }




}
