import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://127.0.0.1:8000/api';

  getStatusTasks( ) {
    return this.http.get<any>(`${this.apiUrl}/status/tasks`);
  }

  getStatusMeetings( ) {
    return this.http.get<any>(`${this.apiUrl}/status/meetings`);
  }

  getStatusWallets( ) {
    return this.http.get<any>(`${this.apiUrl}/status/obligations`);
  }
}
