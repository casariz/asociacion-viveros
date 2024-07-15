import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

const AUTH_API = 'http://localhost:8000/api/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
  
  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(AUTH_API + 'login', credentials, httpOptions).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
          this.authState.next(true);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(AUTH_API + 'register', userData, httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'logout', {}, httpOptions).pipe(
      tap(() => {
        this.removeToken();
        this.authState.next(false);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('auth-token', token);
    this.authState.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  removeToken(): void {
    localStorage.removeItem('auth-token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role; // Ajusta según la estructura de tu token JWT
    }
    return null;
  }
}
