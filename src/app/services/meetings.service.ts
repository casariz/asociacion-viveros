import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  private meetingId: number | null = null;

  constructor(private http: HttpClient) { }

  getMeetings(page: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/meetings?page=${page}`);
  }

  createMeeting(meeting: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/meetings`, meeting);
  }

  getMeetingById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/meetings/${id}`);
  }

  updateMeeting(id: number, meeting: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/meetings/${id}/update`, meeting);
  }

  completeMeeting(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/meetings/${id}/complete`, []);
  }

  setMeetingId(id: number): void {
    this.meetingId = id;
  }

  clearMeetingId(): void {
    this.meetingId = null;
  }

  getMeetingId(): number | null {
    return this.meetingId;
  }
}
