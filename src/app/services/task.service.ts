import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks`);
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks/${id}`);
  }

  createTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks`, task);
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}`, task);
  }
}
