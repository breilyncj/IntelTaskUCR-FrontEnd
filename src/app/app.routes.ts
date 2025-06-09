import { Routes } from '@angular/router';
import {EstadoComponent} from './components/estado-component/estado-component';

export const routes: Routes = [
  { path: 'estados', component: EstadoComponent},
  { path: '', redirectTo: 'estados', pathMatch: 'full' },
  { path: '**', redirectTo: 'estados'}
];
