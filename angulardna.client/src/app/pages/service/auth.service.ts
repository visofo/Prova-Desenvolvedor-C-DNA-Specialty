import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient, private router: Router) { }

    login(login: string, senha: string): Observable<boolean> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, { login, senha }).pipe(
            map(response => {
                localStorage.setItem('token', response.token);

                return true;
            }),
            catchError(error => {
                console.error(error);
                return of(false);
            })
        );
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        return !!token;
    }

    logout(): void {
        // Remove o token de autenticação do localStorage
        localStorage.removeItem('token');

        // Redireciona para a página de login após o logout
        this.router.navigate(['auth/login']);
    }
}
