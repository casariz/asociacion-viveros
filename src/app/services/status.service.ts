import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) { }

  getStatusTasks( ) {
    return this.http.get<any>(`${environment.apiUrl}/status/tasks`);
  }

  getStatusMeetings( ) {
    return this.http.get<any>(`${environment.apiUrl}/status/meetings`);
  }

  getStatusWallets( ) {
    return this.http.get<any>(`${environment.apiUrl}/status/obligations`);
  }
}
