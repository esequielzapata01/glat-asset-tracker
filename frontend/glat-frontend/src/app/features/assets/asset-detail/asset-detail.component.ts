import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService, Asset } from '../../../core/services/asset.service';

interface SensorStatus {
  sensorName: string;
  value: number;
  healthScore: number;
}

interface AssetStatus {
  assetId: string;
  status: string;
  healthScore: number;
  lastTelemetry: string;
  sensors: SensorStatus[];
}

@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-detail.component.html'
})
export class AssetDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private assetService = inject(AssetService);

  asset: Asset | null = null;
  assetStatus: AssetStatus | null = null;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const assetId = this.route.snapshot.paramMap.get('id');

    if (!assetId) {
      this.errorMessage = 'No se recibió el ID del asset';
      this.loading = false;
      return;
    }

    this.loadAssetData(assetId);
  }

  loadAssetData(assetId: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.assetService.getAssetById(assetId).subscribe({
      next: (assetResponse) => {
        this.asset = assetResponse;

        this.assetService.getAssetStatus(assetId).subscribe({
          next: (statusResponse) => {
            this.assetStatus = statusResponse;
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'No se pudo cargar el estado del asset';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el asset';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/assets']);
  }

  getStatusLabel(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'Saludable';
      case 'warning':
        return 'Advertencia';
      case 'critical':
        return 'Crítico';
      default:
        return 'Sin datos';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  getHealthBarClass(score?: number): string {
    if (score == null) return 'bg-slate-300';
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  goToNewTelemetry(): void {
    if (!this.asset) return;
    this.router.navigate(['/telemetry/new'], {
      queryParams: { assetId: this.asset.id }
    });
  }

}