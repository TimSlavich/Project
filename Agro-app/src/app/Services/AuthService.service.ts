import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000';
  isLoggedIn = false;

  constructor(private http: HttpClient) {}

  register(registrationData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, registrationData);
  }

  login(loginData: any): Observable<any> {
    this.isLoggedIn = true;
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

  logout() {
    this.isLoggedIn = false;
  }
}
