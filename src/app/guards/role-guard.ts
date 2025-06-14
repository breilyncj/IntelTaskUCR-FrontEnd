import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {LoginService} from '../services/login-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const rolesPermitidos: number[] = route.data['roles'] ?? []; // puede ser undefined

  if (rolesPermitidos.length === 0) {
    // Si no se especificaron roles, permitir a todos los usuarios logeados
    console.log('No hay roles asignados, permitiendo a todos los usuarios');
    return loginService.isLoggedIn() ? true : router.createUrlTree(['/login']);
  }

  if (loginService.hasRole(rolesPermitidos)) {
    return true;
  }
  console.log('No tiene permisos');
  console.log(loginService.getUser());
  console.log(loginService.getUser()?.id_rol);
  router.createUrlTree(['/unauthorized']);
  return false;
};
