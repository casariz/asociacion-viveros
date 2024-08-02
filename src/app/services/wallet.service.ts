import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletService {

  constructor(private http: HttpClient) {}

  getWallets(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/obligations`);
  }

  createWallet(obligation: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/obligations`, obligation);
  }

  getWalletById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/obligations/${id}`);
  }

  updateWallet(id: number, obligation: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/obligations/${id}/update`, obligation);
  }

  deleteWallet(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/obligations/${id}/delete`, []);
  }

  getPayment(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/payments/${id}`);
  }

  createPayment(payment: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/payments`, payment);
  }
}
