import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

import { AuthService as GeneratedAuthService } from '../../api-client/api/auth.service';
import { LoginRequest } from '../../api-client/model/loginRequest';
import { LoginResponse } from '../../api-client/model/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private generatedAuthService = inject(GeneratedAuthService);
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.generatedAuthService.authLoginPost(payload).pipe(
      tap((response: LoginResponse) => {
        if (this.isBrowser) {
          localStorage.setItem('token', response.token ?? '');
          localStorage.setItem('tokenExpiresAt', response.expiresAt ?? '');
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
    if (!this.isBrowser) return false;

    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('tokenExpiresAt');

    if (!token || !expiresAt) {
      return false;
    }

    return new Date(expiresAt) > new Date();
  }
}