import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TareasService} from '../../services/tareas-service';
import {Tarea, TareasCreate} from '../../models/tarea.model';
import { SidenavService } from '../../services/sidenav-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule  } from '@angular/forms';
import {RouterModule, Router} from '@angular/router';
import {UsuarioService} from '../../services/usuario-service';
import {LoginService} from '../../services/login-service';
import {UsuarioAsignado} from '../../models/usuario.model';
import {EstadoService} from '../../services/estado-service';
import Swal from 'sweetalert2';
import {TareaConRelacionesVista} from '../../models/tarea-con-relaciones-vista.model';

declare var bootstrap: any;

@Component({
  selector: 'app-tareas-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule ],
  templateUrl: './tareas-component.html',
  styleUrl: './tareas-component.css'
})
export class TareasComponent implements OnInit{
  tareas: Tarea[] = [];
  loading = true;
  error: string | null = null;
  sidenavExpandido: boolean = true;
  estados: any[] = [];
  tareasOriginal: Tarea[] = [];
  tareaConRelacionesVista: TareaConRelacionesVista[] = [];
  tareasFiltradas: Tarea[] = [];
  usuarioActualId: number | null = null;
  tareaActual: TareasCreate | null = null;


  form: FormGroup;
  activeButton: string = 'todas';

  seleccionHabilitada: boolean = false;
  tareaSeleccionadaId: number | null = null;

  mostrarDescripcion = false;

  filtroEstado: string = '';
  // filtroUsuario: string = '';
  // filtroPrioridad: string = '';
  // filtroComplejidad: string = '';
  // filtroFechaLimite: string = '';
  // filtroFechaFinalizacion: string = '';
  // filtroTitulo: string = '';
  // filtroDescripcion: string = '';
  // filtroNumeroGIS: string = '';
  // filtroUsuarioAsignado: string = '';

  constructor(
    private fb: FormBuilder,
    private estadosService: EstadoService,
    private tareasService: TareasService,
    private sidenavService: SidenavService,
    private usuarioService: UsuarioService,
    private loginService: LoginService
  ) {
    this.form = this.fb.group({

      descripcionEspera: [''], // puede ser null

      estadoSeleccionado: [null, Validators.required],

    });
  }

  getTareasByEstado(estadoSeleccionado: string){
    console.log(estadoSeleccionado);
    if (!estadoSeleccionado) {
      console.log("No hay estado seleccionado. Mostrando todas las tareas.");
      this.tareasFiltradas = [...this.tareas]; // copia de todas
      return;
    }
    console.log("Filtrando tareas por estado...");
    this.tareasFiltradas = this.tareas.filter(tarea =>
      tarea.estado?.trim().toLowerCase() === estadoSeleccionado.trim().toLowerCase()
    );
  }

  public getAllWithRelaciones(): void {
    this.tareasService.getAllWithRelaciones().subscribe({
      next: (data) => {
        this.tareasOriginal = data;
        this.tareas = data;
        this.tareasFiltradas = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las tareas con relaciones';
        this.loading = false;
      }
    });
  }


  private escucharSidenav() {
    this.sidenavService.collapsed$.subscribe((estado) => {
      this.sidenavExpandido = !estado;

      // Forzar reflow/redibujo
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 200);
    });
  }

  public getAllAsignadasAMi() {
    this.loading = true;
    const idUsuario = this.loginService.getUser()?.cN_Id_usuario;

    this.tareasService.getAllByIdUsuarioAsignado(idUsuario).subscribe({
      next: (data) => {
        this.tareas = data;
        this.tareasFiltradas = [...data];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
        this.error = 'Error al cargar las tareas asignadas a mí';
        this.loading = false;
      }
    });
  }

  public getAllAsignadasPorMi() {
    this.loading = true;
    const idUsuario = this.loginService.getUser()?.cN_Id_usuario;

    this.tareasService.getAllByIdUsuarioCreador(idUsuario).subscribe({
      next: (data) => {
        this.tareas = data;
        this.tareasFiltradas = [...data];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
        this.error = 'Error al cargar las tareas asignadas por mí';
        this.loading = false;
      }
    });
  }

  setActiveButton(buttonName: string) {
    this.activeButton = buttonName;

    if (buttonName === 'todas') {
      this.filtroEstado = '';
      this.tareas = [...this.tareasOriginal];      // Recupera todas
      this.tareasFiltradas = [...this.tareasOriginal];  // Muestra todas
      console.log("Botón TODAS: recargo desde copia local");
    }
  }

  toggleSeleccion(): void {
    this.seleccionHabilitada = !this.seleccionHabilitada;
    if (!this.seleccionHabilitada) {
      this.tareaSeleccionadaId = null;
    }
  }


  intentarSeleccionarTarea(item: Tarea) {
    if (this.estaVencida(item.fechaLimite)) {
      Swal.fire({
        icon: 'warning',
        title: 'Tarea vencida',
        text: 'No puede crear una subtarea porque la tarea padre ya venció.'
      });
      return;
    }

    // Si no está vencida, permitir selección
    this.tareaSeleccionadaId = item.id;
  }

  estaVencida(fecha: string | Date | undefined): boolean {
    if (!fecha) return false;
    return new Date(fecha) < new Date();
  }

  puedeEditarTarea(item: Tarea): boolean {
    const usuario = this.loginService.getUser();
    const puedeEditar = item.usuarioCreadorId === usuario?.cN_Id_usuario;
    return puedeEditar;
  }

  getEstados(): void {
    this.estadosService.getAll().subscribe({
      next: (data) => {
        this.estados = data;
        console.log('Complejidades recibidas:', this.estados);
      },
      error: (error) => {
        console.error('Error al cargar los estados:', error);
      }
    });
  }


  onEstadoChange() {
    const idEstado = this.form.get('estadoSeleccionado')?.value;
    const estadoSeleccionadoObj = this.estados.find(e => e.id === +idEstado);

    console.log('Estado seleccionado:', idEstado, estadoSeleccionadoObj);
    // Mostrar textarea si id es 4 o si el nombre es "En espera" (case insensitive)
    this.mostrarDescripcion =
      idEstado === 4 ||
      (estadoSeleccionadoObj?.estado.toLowerCase() === 'en espera');

    const descripcionControl = this.form.get('descripcionEspera');

    if (this.mostrarDescripcion) {
      descripcionControl?.setValidators([Validators.required, Validators.minLength(5)]);
    } else {
      descripcionControl?.clearValidators();
      descripcionControl?.setValue('');
    }

    descripcionControl?.updateValueAndValidity();
  }

  //Para editarEstados
  cargarTarea(id: number): void {
    this.tareasService.getById(id).subscribe({
      next: (tarea) => {
        if (!tarea) {
          console.error('Tarea no encontrada');
          return;
        }

        this.tareaActual = tarea;

        this.form.patchValue({
          estadoSeleccionado: tarea.cN_Id_estado,
          descripcionEspera: tarea.cT_Descripcion_espera
        });
      },
      error: (err) => {
        console.error('Error al cargar la tarea', err);
      }
    });
  }

  modificarEstado(): void {
    if (!this.tareaActual) {
      console.error('No hay tarea cargada');
      return;
    }

    if (this.form.invalid) {
      console.warn('Formulario inválido');
      return;
    }

    const nuevaTarea: TareasCreate = {
      ...this.tareaActual, // mantiene campos anteriores
      cN_Id_estado: Number(this.form.get('estadoSeleccionado')?.value),
      cT_Descripcion_espera: this.form.get('descripcionEspera')?.value ?? ''
    };

    this.tareasService.editarTarea(nuevaTarea.cN_Id_tarea!, nuevaTarea).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Estado actualizado',
          text: 'La tarea fue modificada correctamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {

          this.getAllWithRelaciones();

          this.form.reset();
          this.mostrarDescripcion = false;
          this.tareaActual = null;
          this.tareaSeleccionadaId = 0;
        });
      }});
  }

  ngOnInit(): void {
    this.usuarioActualId = this.loginService.getUser()?.cN_Id_usuario ?? null;
    this.getAllWithRelaciones();
    this.getEstados();
    this.escucharSidenav();
  }
}
