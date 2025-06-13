import { Routes } from '@angular/router';
import {EstadoComponent} from './components/estado-component/estado-component';
import {HomeComponent} from './components/home-component/home-component';
import {SidenavComponent} from './components/sidenav-component/sidenav-component';
import {NavbarComponent} from './components/navbar-component/navbar-component';
import {TareasComponent} from './components/tareas-component/tareas-component';
import {DetalleTareaComponent} from './components/detalle-tarea-component/detalle-tarea-component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'estado', component: EstadoComponent },
  { path: 'tareas', component:  TareasComponent },
  {path: 'tareas/:id', component: DetalleTareaComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },

];

