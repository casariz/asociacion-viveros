import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Tasks } from '../interfaces/tasks';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks(page: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/tasks?page=${page}`);
  }

  createTask(task: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/tasks`, task);
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/tasks/${id}`);
  }

  getTaskByMeetingId(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/tasks/${id}/meeting`);
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/tasks/${id}/update`, task);
  }

  rejectTask(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/tasks/${id}/reject`, []);
  }

  completeTask(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/tasks/${id}/complete`, []);
  }
}