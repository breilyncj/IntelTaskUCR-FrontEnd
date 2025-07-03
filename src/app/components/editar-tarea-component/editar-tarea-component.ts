import {Component, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule, ActivatedRoute, Router } from '@angular/router';
import {UsuarioService} from '../../services/usuario-service';
import {TareasService} from '../../services/tareas-service';
import {LoginService} from '../../services/login-service';
import {TareasCreate} from '../../models/tarea.model';
import {AdjuntosService} from '../../services/adjuntos-service';
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

  constructor(
    private fb: FormBuilder,
    private UsuarioService: UsuarioService,
    private tareasService: TareasService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private adjuntosService: AdjuntosService
  ) {
    this.form = this.fb.group({
      tareaOrigen: [null], // puede ser null
      tituloTarea: ['', [Validators.required, Validators.minLength(3)]], // puede ser null
      descripcionTarea: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]], // requerido
      descripcionEspera: [null], // puede ser null
      complejidad: [null, Validators.required], // requerido
      estado: [null], // requerido
      prioridad: [null, Validators.required], // requerido
      numeroGIS: [null], // puede ser null
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

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toISOString().slice(0, 16); // 'yyyy-MM-ddTHH:mm'
  }

  cargarTarea(id: number): void {
    this.tareasService.getById(id).subscribe({
      next: (tarea) => {
        this.tareaActual = tarea;

        this.form.patchValue({
          tituloTarea: tarea.cT_Titulo_tarea,
          descripcionTarea: tarea.cT_Descripcion_tarea,
          prioridad: tarea.cN_Id_prioridad,
          complejidad: tarea.cN_Id_complejidad,
          numeroGIS: tarea.cN_Numero_GIS,
          fechaLimite: this.formatearFecha(tarea.cF_Fecha_limite),
          fechaFinalizacion: this.formatearFecha(tarea.cF_Fecha_finalizacion),
          usuarioAsignado: tarea.cN_Usuario_asignado
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
