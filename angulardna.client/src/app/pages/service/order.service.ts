import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private apiUrl = 'http://localhost:5084/api/pedidos';  // Ajuste para a sua URL da API

    constructor(private http: HttpClient) { }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    getOrder(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, order);
    }

     updateOrder(id: number, order: Order): Observable<any> {
        return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
    }
    
    deleteOrder(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}