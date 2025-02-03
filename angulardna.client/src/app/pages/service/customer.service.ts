import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

    private apiUrl = 'http://localhost:5084/api/Clientes';  // Ajuste para a sua URL da API
private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'accept': 'text/plain'
        })
    };
    constructor(private http: HttpClient) { }

    getCustomers(): Observable<Customer[]> {
      return this.http.get<Customer[]>(this.apiUrl, this.httpOptions);
    }

    getCustomer(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.apiUrl}/${id}`, this.httpOptions);
    }

    createCustomer(customer: Customer): Observable<Customer> {
        return this.http.post<Customer>(this.apiUrl, customer, this.httpOptions);
    }

    updateCustomer(id: number, customer: Customer): Observable<any> {
        return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer, this.httpOptions);
    }
    
    deleteCustomer(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, this.httpOptions);
    }
}