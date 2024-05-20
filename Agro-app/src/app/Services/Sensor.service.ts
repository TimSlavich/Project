import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sensor } from '../Interfaces/Sensor';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getSensorsByFarmerId(farmerId: string): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.baseUrl}/sensors/${farmerId}`);
  }

  getPlantStatusFarmerId(farmerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/plantStatus/${farmerId}`);
  }

  changeWatering(TypeName: string, newValue: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/sensors/${TypeName}/sensor/water-sensor`, {TypeName, newValue});
  }
}