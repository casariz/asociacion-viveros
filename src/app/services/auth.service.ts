import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  api_url = 'http://localhost:8000/api'

  login(credentials: any) {
    this.http.post(`${this.api_url}/auth/login`, credentials, { withCredentials: true }).pipe()
  }
}
