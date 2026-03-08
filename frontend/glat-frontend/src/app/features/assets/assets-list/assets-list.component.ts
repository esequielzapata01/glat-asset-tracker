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
}