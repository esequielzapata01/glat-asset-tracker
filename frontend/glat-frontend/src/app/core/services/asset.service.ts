import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Asset {
  id: string;
  name: string;
  type: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.apiUrl}/assets`);
  }

  getAssetById(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.apiUrl}/assets/${id}`);
  }

  getAssetStatus(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/assets/${id}/status`);
  }
}