import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssistantMeetingsService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAssistants(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/assistants`);
  }

  addAssistants(assistants: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assistants`, assistants);
  }

  addAssistantsMeeting(assistants: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assistant_meetings`, assistants);
  }

  getAssistantByMeeting(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/assistants/${id}`);
  }

  deleteAssistant(meeting_id: number, user_id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/assistants/${meeting_id}/delete/${user_id}`, {});
  }
}
