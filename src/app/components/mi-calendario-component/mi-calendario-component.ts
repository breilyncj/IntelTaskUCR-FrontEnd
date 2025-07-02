import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, CalendarEvent, CalendarView  } from 'angular-calendar';
import { addMonths, subMonths } from 'date-fns';
import { Subject } from 'rxjs';
import { TareasService } from '../../services/tareas-service';
import {FormBuilder, Validators} from '@angular/forms';
import {Tarea} from '../../models/tarea.model';
import { CalendarMonthViewDay } from 'angular-calendar';

declare var bootstrap: any;

export interface MiCalendarEvent extends CalendarEvent {
  prioridad: number;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  templateUrl: './mi-calendario-component.html',
  styleUrls: ['./mi-calendario-component.css']
})
export class MiCalendarioComponent implements OnInit {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month; // controlar vista actual
  mostrarLeyenda = false;
  tareas: Tarea[] = [];
  loading = true;
  error: string | null = null;
  diasConVerMas: { [key: string]: boolean } = {};
  verMasDia: string | null = null;
  diaSeleccionado: Date | null = null;

  events: MiCalendarEvent[] = [];
  tareasDelDia: MiCalendarEvent[] = [];

  CalendarView = CalendarView;
  refresh: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private tareasService: TareasService,
  ) {}

  prioridades = [
    { id: 1, nombre: 'Muy alta', color: '#f06292' },
    { id: 2, nombre: 'Alta', color: '#ff6b6b' },
    { id: 3, nombre: 'Media', color: '#17a2b8' },
    { id: 4, nombre: 'Baja', color: '#adb5bd' },
    { id: 5, nombre: 'Muy baja', color: '#6f42c1' },
  ];


  irHoy() {
    this.viewDate = new Date();
  }

  irAlMesAnterior() {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  irAlMesSiguiente() {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  toggleLeyenda() {
    this.mostrarLeyenda = !this.mostrarLeyenda;
  }

  public getAllWithRelaciones(): void {
    this.tareasService.getAllWithRelaciones().subscribe({
      next: (data) => {
        this.tareas = data;
        this.loading = false;
        this.events = this.tareas.map(tarea => ({
          start: new Date(tarea.fechaAsignacion ?? new Date()),
          end: tarea.fechaLimite ? new Date(tarea.fechaLimite) : undefined,
          title: tarea.titulo || 'Sin título',
          prioridad: tarea.prioridad,
          color: {
            primary: this.obtenerColorPorPrioridadId(tarea.prioridad),
            secondary: ''
          },
          allDay: true
        }));

        this.refresh.next();

      },
      error: (error) => {
        this.error = 'Error al cargar las tareas con relaciones';
        this.loading = false;
      }
    });
  }

  obtenerColorPorPrioridadId(idPrioridad: number): string {
    switch (idPrioridad) {
      case 1: return '#d32f2f'; // Muy Alta - rojo fuerte
      case 2: return '#f57c00'; // Alta - naranja
      case 3: return '#0288d1'; // Media - azul intenso
      case 4: return '#7cb342'; // Baja - verde suave
      case 5: return '#9e9e9e'; // Muy baja - gris medio
      default: return '#1e88e5'; // azul base
    }
  }

  obtenerNombrePrioridad(idPrioridad?: number): string {
    if (!idPrioridad) return 'Desconocida';
    const prioridad = this.prioridades.find(p => p.id === idPrioridad);
    return prioridad ? prioridad.nombre : 'Desconocida';
  }


  toggleVerMas(day: CalendarMonthViewDay): void {
    const dia = day.date.toDateString();
    this.verMasDia = this.verMasDia === dia ? null : dia;
  }


  abrirModalVerMas(day: CalendarMonthViewDay): void {
    this.diaSeleccionado = day.date;
    this.tareasDelDia = day.events as MiCalendarEvent[]; // 👈 le dices: confía, son MiCalendarEvent!
    const modal = new bootstrap.Modal(document.getElementById('modalVerMas')!);
    modal.show();
  }

  esOtroMes(day: any): boolean {
    return day.date.getMonth() !== this.viewDate.getMonth();
  }



  ngOnInit(): void {

    this.getAllWithRelaciones();
  }
}
