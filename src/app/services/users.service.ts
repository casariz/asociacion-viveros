import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }
 
  getUsers(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/users`);
  }

  getUserById(id: number): Observable<any>{
    return this.http.get(`${environment.apiUrl}/users/${id}`)
  }

  updateUser(id: number, user: any): Observable<any>{
    return this.http.put(`${environment.apiUrl}/users/${id}/update`, user);
  }

  deleteUser(id: number): Observable<any>{
    return this.http.put(`${environment.apiUrl}/users/${id}/delete`,[]);
  }
}
