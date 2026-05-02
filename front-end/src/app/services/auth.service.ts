import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignInPayload {
  userName: string;
  password: string;
}

export interface SignUpPayload {
  userName: string;
  password: string;
  email: string;
  mobileNumber: string;
  country: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';

  constructor(private http: HttpClient) {}

  signIn(payload: SignInPayload): Observable<string> {
    return this.http.post(`${this.base}/signin`, payload, { responseType: 'text' as 'text' });
  }

  signUp(payload: SignUpPayload): Observable<string> {
    return this.http.post(`${this.base}/signup`, payload, { responseType: 'text' as 'text' });
  }

  setUser(user: { userName: string }) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }
}
