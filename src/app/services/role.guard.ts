import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['expectedRoles'];
  const userRole = authService.getUserRole();
  
  if (authService.isLoggedIn() && expectedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
