import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Asset, AssetService, AssetStatus } from '../../../core/services/asset.service';
import { AuthService } from '../../../core/services/auth.service';

interface AssetWithStatus extends Asset {
  assetStatus?: AssetStatus | null;
}

@Component({
  selector: 'app-assets-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assets-list.component.html'
})
export class AssetsListComponent implements OnInit {
  private assetService = inject(AssetService);
  private authService = inject(AuthService);
  private router = inject(Router);

  assets: AssetWithStatus[] = [];
  loading = true;
  errorMessage = '';

  assetToDeleteId: string | null = null;
  showDeleteModal = false;

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.loading = true;
    this.errorMessage = '';

    this.assetService.getAssets().subscribe({
      next: (assets) => {
        if (assets.length === 0) {
          this.assets = [];
          this.loading = false;
          return;
        }

        const requests = assets.map(asset =>
          this.assetService.getAssetStatus(asset.id).pipe(
            catchError(() => of(null))
          )
        );

        forkJoin(requests).subscribe({
          next: (statuses) => {
            this.assets = assets.map((asset, index) => ({
              ...asset,
              assetStatus: statuses[index]
            }));
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'No se pudieron cargar los estados de los assets';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los assets';
        this.loading = false;
      }
    });
  }

  viewAsset(id: string): void {
    this.router.navigate(['/assets', id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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

  getStatusBadgeClass(status?: string): string {
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

  goToCreateAsset(): void {
    this.router.navigate(['/assets/new']);
  }

  openDeleteModal(id: string): void {
    this.assetToDeleteId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.assetToDeleteId = null;
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.assetToDeleteId) {
      return;
    }

    this.assetService.deleteAsset(this.assetToDeleteId).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadAssets();
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar el asset';
        this.closeDeleteModal();
      }
    });
  }

  get totalAssets(): number {
    return this.assets.length;
  }

  get healthyAssets(): number {
    return this.assets.filter(a => a.assetStatus?.status?.toLowerCase() === 'healthy').length;
  }

  get warningAssets(): number {
    return this.assets.filter(a => a.assetStatus?.status?.toLowerCase() === 'warning').length;
  }

  get criticalAssets(): number {
    return this.assets.filter(a => a.assetStatus?.status?.toLowerCase() === 'critical').length;
  }

  get averageHealthScore(): number {
    const withStatus = this.assets.filter(a => a.assetStatus?.healthScore != null);

    if (withStatus.length === 0) {
      return 0;
    }

    const total = withStatus.reduce((sum, a) => sum + (a.assetStatus?.healthScore ?? 0), 0);
    return Math.round(total / withStatus.length);
  }

}