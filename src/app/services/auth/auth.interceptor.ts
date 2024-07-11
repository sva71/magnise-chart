import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isTokenValid = this.authService.isTokenValid();
    const tokenData = this.authService.tokenData;

    if (!tokenData || !isTokenValid) {
      return this.authService.getNewToken().pipe(switchMap(token => {
        if (!token) {
          return next.handle(req);
        }
        const newCloned = req.clone({
          setHeaders: {
            Authorization: `${token.token_type} ${token.access_token}`
          }
        });
        return next.handle(newCloned);
      }))
    } else {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `${tokenData.token_type} ${tokenData.access_token}`
        }
      });
      return next.handle(cloned);
    }
  }
}
