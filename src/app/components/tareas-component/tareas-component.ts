import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Estado} from '../../models/estado.model';
import {EstadoService} from '../../services/estado-service';
import {TareasService} from '../../services/tareas-service';
import {Tarea} from '../../models/tarea.model';

@Component({
  selector: 'app-tareas-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tareas-component.html',
  styleUrl: './tareas-component.css'
})
export class TareasComponent implements OnInit{
  tareas: Tarea[] = [];
  loading = true;
  error: string | null = null;

  constructor(private tareasService: TareasService) {
  }

  ngOnInit(): void {
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
}
