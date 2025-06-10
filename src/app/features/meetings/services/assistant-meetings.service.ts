import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssistantMeetingsService {

  constructor(private http: HttpClient) {}

  getAssistants(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/assistants`);
  }

  addAssistants(assistants: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/assistants`, assistants);
  }

  addAssistantsMeeting(assistants: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/assistant_meetings`, assistants);
  }

  getAssistantByMeeting(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/assistants/${id}`);
  }

  deleteAssistant(meeting_id: number, user_id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/assistants/${meeting_id}/delete/${user_id}`, {});
  }
}
