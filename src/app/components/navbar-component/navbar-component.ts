import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {TareasService} from '../../services/tareas-service';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css'
})
export class NavbarComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }
}
