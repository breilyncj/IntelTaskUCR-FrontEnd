import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TareasService} from '../../services/tareas-service';
import {Tarea, TareasCreate} from '../../models/tarea.model';

@Component({
  selector: 'app-detalle-tarea-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-tarea-component.html',
  styleUrl: './detalle-tarea-component.css'
})
export class DetalleTareaComponent implements OnInit {
  tarea: TareasCreate | null = null;
  loading = true;
  error = '';

  constructor(
    private tareasService: TareasService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  private getTareaConRelacionesPorId(id: number): void {
    this.tareasService.getTareaWithRelacionesById(id).subscribe({
      next: (data) => {
        this.tarea = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar la tarea con relaciones';
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log(id);
    this.getTareaConRelacionesPorId(id);
  }
}
