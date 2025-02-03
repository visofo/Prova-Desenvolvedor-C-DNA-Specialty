import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {}

    // login(email: string, password: string): Observable<boolean> {
    //     return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
    //         map(response => {
    //             localStorage.setItem('token', response.token);
    //             return true;
    //         }),
    //         catchError(error => {
    //             console.error(error);
    //             return of(false);
    //         })
    //     );
    // }

    isAuthenticated(): boolean {
        //Implementar lógica para verificar se o usuario está logado
        return true;
      }
}