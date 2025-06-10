import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {

  constructor(private http: HttpClient) { }

  getTopics(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/topics`);
  }

  createTopic(topic: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/topics`, topic);
  }

  getTopicsByMeetingId(id: any):Observable<any> {
    return this.http.get(`${environment.apiUrl}/topics/${id}`);
  }

  deleteTopic(id:number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/topics/${id}/delete`, []);
  } 
}
