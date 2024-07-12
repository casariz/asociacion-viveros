import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getWallets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/obligations`);
  }

  createWallet(obligation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/obligations`, obligation);
  }

  getWalletById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obligations/${id}`);
  }

  updateWallet(id: number, obligation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/obligations/${id}/update`, obligation);
  }

  deleteWallet(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/obligations/${id}/delete`, []);
  }

  getPayment(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/${id}`);
  }

  createPayment(payment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments`, payment);
  }
}
