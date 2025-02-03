import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    private apiUrl = 'http://localhost:5084/api/produtos';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'accept': 'text/plain'
        })
    };

    constructor(private http: HttpClient) { }
  
    getProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(this.apiUrl, this.httpOptions);
    }
  
    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`, this.httpOptions);
    }
  
    createProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product, this.httpOptions);
    }

    updateProduct(id: number, product: Product): Observable<any> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product, this.httpOptions);
    }
    
    deleteProduct(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, this.httpOptions);
    }
}