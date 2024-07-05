import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Tasks } from '../interfaces/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tasks`);
  }

  createTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks`, task);
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks/${id}`);
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}/update`, task);
  }

  rejectTask(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}/reject`, []);
  }

  completeTask(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}/complete`, []);
  }
}