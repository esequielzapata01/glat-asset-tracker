import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  expiresAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:8080';

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap(response => {
        if (this.isBrowser) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('tokenExpiresAt', response.expiresAt);
        }
      })
    );
  }

  logout(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiresAt');
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;

    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('tokenExpiresAt');

    if (!token || !expiresAt) {
      return false;
    }

    return new Date(expiresAt) > new Date();
  }
}