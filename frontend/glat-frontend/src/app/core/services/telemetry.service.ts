import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateTelemetryLog {
  assetId: string;
  timestamp: string;
  temperature: number;
  batteryLevel: number;
  vibration: number;
}

export interface TelemetryLog extends CreateTelemetryLog {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';

  createTelemetry(payload: CreateTelemetryLog): Observable<any> {
    return this.http.post(`${this.apiUrl}/telemetry`, payload);
  }

  getTelemetryByAsset(assetId: string): Observable<TelemetryLog[]> {
    return this.http.get<TelemetryLog[]>(`${this.apiUrl}/telemetry/${assetId}`);
  }
}