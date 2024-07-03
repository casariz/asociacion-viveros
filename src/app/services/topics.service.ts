import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getTopics(): Observable<any>{
    return this.http.get(`${this.apiUrl}/topics`);
  }

  createTopic(topic: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/topics/store`, topic);
  }

  getTopicsByMeetingId(id: number):Observable<any> {
    return this.http.get(`${this.apiUrl}/topics/${id}`);
  }

  deleteTopic(id:number): Observable<any> {
    return this.http.post(`${this.apiUrl}/topics/${id}/delete`, []);
  } 
}
