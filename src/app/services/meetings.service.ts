import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  private apiUrl = 'http://127.0.0.1:8000/api';
  private meetingId: number | null = null;

  constructor(private http: HttpClient) { }

  getMeetings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/meetings`);
  }

  createMeeting(meeting: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/meetings`, meeting);
  }

  getMeetingById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/meetings/${id}`);
  }

  updateMeeting(id: number, meeting: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/meetings/${id}/update`, meeting);
  }

  deleteMeeting(id: number, meeting: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/meetings/${id}/delete`, meeting);
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
