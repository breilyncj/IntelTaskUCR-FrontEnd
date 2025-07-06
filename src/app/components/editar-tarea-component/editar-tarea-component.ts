import {Component, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule, ActivatedRoute, Router } from '@angular/router';
import {UsuarioService} from '../../services/usuario-service';
import {TareasService} from '../../services/tareas-service';
import {LoginService} from '../../services/login-service';
import {TareasCreate} from '../../models/tarea.model';
import {AdjuntosService} from '../../services/adjuntos-service';
import {TareasSeguimientoService} from '../../services/tareas-seguimiento-service';
import {TareasSeguimiento} from '../../models/tareas-seguimiento.model';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-editar-tarea-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule ],
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
  tareaActual!: TareasCreate;
  tareasSeguimiento: TareasSeguimiento[] = [];

  constructor(
    private fb: FormBuilder,
    private UsuarioService: UsuarioService,
    private tareasService: TareasService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private adjuntosService: AdjuntosService,
    private tareasSeguimientoService: TareasSeguimientoService
  ) {
    this.form = this.fb.group({
      tareaOrigen: [null], // Si es opcional, está bien con null
      tituloTarea: ['',[Validators.required]], // inicializa con ''
      descripcionTarea: ['', [Validators.required]], // inicializa con ''
      descripcionEspera: ['', []], // inicializa con ''
      complejidad: [null], // Si es requerido, inicializa con null o un valor por defecto
      estado: [null], // inicializa con null o un valor por defecto
      prioridad: [null], // inicializa con null o un valor por defecto
      numeroGIS: ['', []], // inicializa con ''
      fechaAsignacion: [null], // Si es obligatorio, inicializa con null o un valor por defecto
      fechaLimite: [null], // inicializa con null
      fechaFinalizacion: [null], // inicializa con null
      usuarioCreador: [null], // Si es opcional, puedes dejar null
      usuarioAsignado: [null], // Si es opcional, puedes dejar null
      comentario: [''], // inicializa con ''
    });

  }

  roles = [
    { id: 1, nombre: 'Director' },
    { id: 2, nombre: 'Subdirector' },
    { id: 3, nombre: 'Jefe' },
    { id: 4, nombre: 'Coordinador' },
    { id: 5, nombre: 'Profesional 3' },
    { id: 6, nombre: 'Profesional 2' },
    { id: 7, nombre: 'Profesional 1' },
    { id: 8, nombre: 'Técnico' },
    { id: 9, nombre: 'Administrador' },
  ];

  estados = [
    { id: 1, nombre: 'Registrado' },
    { id: 2, nombre: 'Asignado' },
    { id: 3, nombre: 'En proceso' },
    { id: 4, nombre: 'En espera' },
    { id: 5, nombre: 'Terminado' },
    { id: 6, nombre: 'Aprobado' },
    { id: 7, nombre: 'Rechazado' },
    { id: 8, nombre: 'Activo' },
    { id: 9, nombre: 'Inactivo' },
    { id: 10, nombre: 'Asignada' },
    { id: 11, nombre: 'En proceso' },
    { id: 12, nombre: 'Finalizada' },
    { id: 13, nombre: 'En espera' },
    { id: 14, nombre: 'Incumplida' },
    { id: 15, nombre: 'Rechazada' },
    { id: 17, nombre: 'En revisión' }
  ];

  prioridadesLista = [
    { id: 1, nombre: 'Muy Alta' },
    { id: 2, nombre: 'Alta' },
    { id: 3, nombre: 'Media' },
    { id: 4, nombre: 'Baja' },
    { id: 5, nombre: 'Muy Baja' },
  ];


  getNombreRol(id: number | undefined): string {
    const rol = this.roles.find(r => r.id === id);
    return rol ? rol.nombre : 'No especificado';
  }

  getNombreEstado(id: number | undefined): string {
    const estado = this.estados.find(e => e.id === id);
    return estado ? estado.nombre : 'Desconocido';
  }

  getNombrePrioridad(id: number | undefined): string {
    const prioridad = this.prioridadesLista.find(p => p.id === id);
    return prioridad ? prioridad.nombre : 'Sin prioridad';
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

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toISOString().slice(0, 16); // 'yyyy-MM-ddTHH:mm'
  }

  cargarTarea(id: number): void {
    this.tareasService.getById(id).subscribe({
      next: (tarea) => {
        this.tareaActual = tarea;

        // Asegúrate de que los valores estén asignados correctamente
        this.form.patchValue({
          tituloTarea: tarea.cT_Titulo_tarea || '', // Si es nulo o vacío, asigna una cadena vacía
          descripcionTarea: tarea.cT_Descripcion_tarea || '', // Lo mismo para la descripción
          prioridad: tarea.cN_Id_prioridad || '', // Asignar valor por defecto si no está presente
          complejidad: tarea.cN_Id_complejidad || '', // Asignar valor por defecto si no está presente
          numeroGIS: tarea.cN_Numero_GIS || '', // Asignar valor por defecto si no está presente
          fechaLimite: tarea.cF_Fecha_limite ? this.formatearFecha(tarea.cF_Fecha_limite) : '', // Asignar valor adecuado
          fechaFinalizacion: tarea.cF_Fecha_finalizacion ? this.formatearFecha(tarea.cF_Fecha_finalizacion) : '', // Asignar valor adecuado
          estado: tarea.cN_Id_estado || '', // Asignar valor por defecto si no está presente
          usuarioAsignado: tarea.cN_Usuario_asignado || null // Si no hay usuario asignado, dejar null
        });

        this.cdr.detectChanges();
        console.log('✔️ Datos precargados al formulario');
      },
      error: (err) => {
        console.error('Error al cargar tarea:', err);
      }
    });
  }



  guardarCambios(input: HTMLInputElement): void {
    if (this.form.invalid || !this.tareaActual) {
      console.warn('Formulario inválido o tarea no cargada');
      return;
    }

    const tareaEditada: TareasCreate = {
      ...this.tareaActual, // campos fijos
      cT_Titulo_tarea: this.form.get('tituloTarea')?.value,
      cT_Descripcion_tarea: this.form.get('descripcionTarea')?.value,
      cN_Id_prioridad: this.form.get('prioridad')?.value,
      cN_Id_complejidad: this.form.get('complejidad')?.value,
      cF_Fecha_limite: new Date(this.form.get('fechaLimite')?.value),
      cF_Fecha_finalizacion: new Date(this.form.get('fechaFinalizacion')?.value),
      cN_Usuario_asignado: this.form.get('usuarioAsignado')?.value
    };

    const archivo = input.files?.[0];
    const idUsuario = Number(this.loginService.getUser()?.cN_Id_usuario ?? null);

    this.tareasService.editarTarea(tareaEditada.cN_Id_tarea!, tareaEditada).subscribe({
      next: () => {
        console.log('Tarea modificada');
        if (archivo) {
          const formData = new FormData();
          formData.append('archivo', archivo);
          this.adjuntosService.subirAdjunto(formData, tareaEditada.cN_Id_tarea!, idUsuario).subscribe({
            next: () => {
              Swal.fire('Éxito', 'Tarea modificada y archivo subido', 'success');
              setTimeout(() => {
                this.router.navigate(['/tareas']);
              }, 1500);
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error al subir el archivo adjunto', err);
              Swal.fire('Advertencia', 'Tarea modificada pero el archivo no se subió', 'warning');
            }
          });
        } else {
          Swal.fire('Éxito', 'Tarea modificada correctamente', 'success');
          setTimeout(() => {
            this.router.navigate(['/tareas']);
          }, 1500);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error al guardar cambios', err);
        Swal.fire('Error', 'No se pudo modificar la tarea', 'error');
      }
    });
  }

  crearSeguimiento(): void {
    if (this.form.get('comentario')?.invalid || !this.tareaActual) {
      console.warn('Comentario inválido o tarea no cargada');
      return;
    }

    const now = new Date();

    const nuevoSeguimiento: TareasSeguimiento = {
      cN_Id_tarea: this.tareaActual.cN_Id_tarea!,
      cT_Comentario: this.form.get('comentario')?.value,
      cF_Fecha_seguimiento: now,
    };

    this.tareasSeguimientoService.crearSeguimiento(nuevoSeguimiento).subscribe({
      next: (res) => {
        Swal.fire('Éxito', 'Comentario guardado correctamente', 'success');
        this.form.get('comentario')?.reset();
      },
      error: (err) => {
        console.error('Error creando seguimiento', err);
        Swal.fire('Error', 'No se pudo guardar el comentario', 'error');
      }
    });
  }



  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cargarTarea(id);
    }

    this.getUsuarios();
    this.getPrioridades();
    this.getComplejidades();
  }
}
