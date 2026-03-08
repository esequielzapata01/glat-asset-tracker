import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from '../../../core/services/asset.service';

@Component({
  selector: 'app-asset-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './asset-create.component.html'
})
export class AssetCreateComponent {
  private fb = inject(FormBuilder);
  private assetService = inject(AssetService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  form = this.fb.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    type: ['', Validators.required],
    location: [''],
    latitude: [null as number | null],
    longitude: [null as number | null]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.assetService.createAsset({
      id: this.form.value.id!,
      name: this.form.value.name!,
      type: this.form.value.type!,
      location: this.form.value.location || '',
      latitude: this.form.value.latitude ?? undefined,
      longitude: this.form.value.longitude ?? undefined
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/assets']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo crear el asset';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/assets']);
  }
}