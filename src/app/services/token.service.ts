import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {}

  saveToken(token: string): void {
    localStorage.setItem('auth-token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  removeToken(): void {
    localStorage.removeItem('auth-token');
  }
}
