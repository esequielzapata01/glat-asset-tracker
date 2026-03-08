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

export interface AssetStatus {
  assetId: string;
  status: string;
  healthScore: number;
  lastTelemetry: string;
  sensors: {
    sensorName: string;
    value: number;
    healthScore: number;
  }[];
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

  getAssetStatus(id: string): Observable<AssetStatus> {
    return this.http.get<AssetStatus>(`${this.apiUrl}/assets/${id}/status`);
  }

   createAsset(asset: Asset): Observable<Asset> {
    return this.http.post<Asset>(`${this.apiUrl}/assets`, asset);
  }
  
}