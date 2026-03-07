import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Asset, AssetService } from '../../../core/services/asset.service';
import { AuthService } from '../../../core/services/auth.service';

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

  assets: Asset[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.loading = true;
    this.errorMessage = '';

    this.assetService.getAssets().subscribe({
      next: (data) => {
        this.assets = data; 
        this.loading = false;
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
}