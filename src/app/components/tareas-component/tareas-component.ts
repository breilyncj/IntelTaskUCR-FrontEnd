import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TareasService} from '../../services/tareas-service';
import {Tarea} from '../../models/tarea.model';
import { SidenavService } from '../../services/sidenav-service';

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
  sidenavExpandido: boolean = true;

  constructor(private tareasService: TareasService, private sidenavService: SidenavService) {
  }

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
