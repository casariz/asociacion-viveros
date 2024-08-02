import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

const AUTH_API = 'http://localhost:8000/api/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
  private userType: string | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/login', credentials, httpOptions).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
        }
      }),
      switchMap(() => this.fetchUserType()), 
      tap(() => {
        this.authState.next(true);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/register', userData, httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(environment.apiUrl + '/logout', {}, httpOptions).pipe(
      tap(() => {
        this.removeToken();
        this.authState.next(false);
        location.reload();
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('auth-token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  removeToken(): void {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-type');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  fetchUserType(): Observable<any> {
    return this.http.get(environment.apiUrl + '/user_type', httpOptions).pipe(
      tap((response: any) => {
        if (response.user_type) {
          this.userType = response.user_type;
          localStorage.setItem('user-type', response.user_type);
        }
      })
    );
  }

  getUserRole(): string | null {
    if (this.userType) {
      return this.userType;
    }
    const savedUserType = localStorage.getItem('user-type');
    if (savedUserType) {
      this.userType = savedUserType;
      return this.userType;
    }
    return null;
  }
}
