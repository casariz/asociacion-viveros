import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const expectedRoles = route.data['expectedRoles'] as Array<string>;
  const userRole = authService.getUserRole();

  if (authService.isLoggedIn() && userRole && expectedRoles.includes(userRole)) {
    return true;
  } else {
    toastr.error(`Esta funcionalidad no está habilitada para el tipo de usuario: ${userRole}`, 'Acceso Denegado');
    //router.navigate(['/register']);
    return false;
  }
};
