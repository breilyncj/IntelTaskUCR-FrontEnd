import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidenavComponent} from './components/sidenav-component/sidenav-component';
import {NavbarComponent} from './components/navbar-component/navbar-component';
import {HomeComponent} from './components/home-component/home-component';
import {EstadoComponent} from './components/estado-component/estado-component';
import {TareasComponent} from './components/tareas-component/tareas-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,SidenavComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'IntelTaskUCR-FrontEnd';
  sidenavCollapsed = false;
}
