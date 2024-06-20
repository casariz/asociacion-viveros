import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getMeetings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/meetings`);
  }

  createMeeting(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/meetings`, task);
  }

  getMeetingById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/meetings/${id}`);
  }

  updateMeeting(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/meetings/${id}/update`, task);
  }

  deleteMeeting(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/meetings/${id}/delete`, task);
  }
}
