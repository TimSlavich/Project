import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getUserById(farmerId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/${farmerId}`);
  }

  changePassword(farmerId: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${farmerId}/password`, { newPassword });
  }
}
