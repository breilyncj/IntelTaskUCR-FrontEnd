import {Component, OnInit} from '@angular/core';
import {Estado} from '../../models/estado.model';
import {EstadoService} from '../../services/estado-service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-estado-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-component.html',
  styleUrl: './estado-component.css'
})
export class EstadoComponent implements OnInit{
  estados: Estado[] = [];
  loading = true;
  error: string | null = null;

  constructor(private estadoService: EstadoService) {
  }

  ngOnInit(): void {
    this.estadoService.getAll().subscribe({
      next: (data) => {
        this.estados = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'error al cargar los estados'
        this.loading = false;
      }
    });
  }

}
