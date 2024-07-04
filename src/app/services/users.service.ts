import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  private apiUrl = 'http://127.0.0.1:8000/api';
 
  getUsers(): Observable<any>{
    return this.http.get(`${this.apiUrl}/users`);
  }
}
