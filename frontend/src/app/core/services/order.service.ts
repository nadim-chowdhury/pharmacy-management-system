import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Order, Payment } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private orderUrl = `${environment.apiUrl}/orders`;
  private paymentUrl = `${environment.apiUrl}/payments`;

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.orderUrl, order);
  }

  processPayment(payment: Partial<Payment>): Observable<Payment> {
    return this.http.post<Payment>(this.paymentUrl, payment);
  }
}
