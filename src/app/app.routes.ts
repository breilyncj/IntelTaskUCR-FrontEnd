import { Routes } from '@angular/router';
import {EstadoComponent} from './components/estado-component/estado-component';
import {HomeComponent} from './components/home-component/home-component';
import {SidenavComponent} from './components/sidenav-component/sidenav-component';
import {NavbarComponent} from './components/navbar-component/navbar-component';
import {TareasComponent} from './components/tareas-component/tareas-component';
import {DetalleTareaComponent} from './components/detalle-tarea-component/detalle-tarea-component';
import {PerfilComponent} from './components/perfil-component/perfil-component';
import {LoginComponent} from './components/login-component/login-component';
import {roleGuard} from './guards/role-guard';
import {UnauthorizedComponent} from './components/unauthorized-component/unauthorized-component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [roleGuard]},
  { path: 'estado', component: EstadoComponent },
  { path: 'tareas', component:  TareasComponent, canActivate: [roleGuard], data: { roles: [1, 2, 3] }},
  {path: 'tareas/:id', component: DetalleTareaComponent, canActivate: [roleGuard], data: { roles: [1, 2, 3] } },
  {path: 'perfil', component: PerfilComponent, canActivate: [roleGuard]},
  {path: 'login', component: LoginComponent},
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },

];

