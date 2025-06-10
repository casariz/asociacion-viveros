// ARCHIVO OBSOLETO - La funcionalidad de autenticación ha sido eliminada
// Esta aplicación ahora es de acceso público sin autenticación

/*
import { HttpRequest, HttpHandlerFn, HttpInterceptorFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Ajusta el path según tu estructura

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = new AuthService(null as any); // Esto es una simulación. Ajusta para obtener el servicio correctamente.
  const authToken = authService.getToken();
  if (authToken) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(cloned);
  } else {
    return next(req);
  }
};
*/
