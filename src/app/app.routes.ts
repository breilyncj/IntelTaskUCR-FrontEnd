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
import {NuevaTareaComponent} from './components/nueva-tarea-component/nueva-tarea-component';
import {EditarTareaComponent } from './components/editar-tarea-component/editar-tarea-component';
import {NotificacionComponent} from './components/notificacion-component/notificacion-component';
import {PermisosComponent} from './components/permisos-component/permisos-component';
import {MiCalendarioComponent} from './components/mi-calendario-component/mi-calendario-component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [roleGuard]},
  { path: 'estado', component: EstadoComponent },
  { path: 'tareas', component:  TareasComponent, canActivate: [roleGuard], data: { roles: [1, 2, 3] }},
  {path: 'tareas/:id', component: DetalleTareaComponent, canActivate: [roleGuard], data: { roles: [1, 2, 3] } },
  {path: 'perfil', component: PerfilComponent, canActivate: [roleGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'nuevaTarea', component: NuevaTareaComponent},
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'editarTarea/:id', component: EditarTareaComponent },
  {path: 'nuevaTarea/:id', component: NuevaTareaComponent},
  {path: 'notificacion', component: NotificacionComponent},
  {path: 'permisos', component: PermisosComponent},
  {path: 'miCalendario', component: MiCalendarioComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },

];

