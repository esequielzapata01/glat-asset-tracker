    import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryService } from '../../../core/services/telemetry.service';

@Component({
  selector: 'app-telemetry-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './telemetry-create.component.html'
})
export class TelemetryCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private telemetryService = inject(TelemetryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  errorMessage = '';

  form = this.fb.group({
    assetId: ['', Validators.required],
    timestamp: ['', Validators.required],
    temperature: [null as number | null, Validators.required],
    batteryLevel: [null as number | null, Validators.required],
    vibration: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    const assetId = this.route.snapshot.queryParamMap.get('assetId');

    if (assetId) {
      this.form.patchValue({
        assetId,
        timestamp: this.getNowForDatetimeLocal()
      });
    } else {
      this.form.patchValue({
        timestamp: this.getNowForDatetimeLocal()
      });
    }
  }

  private getNowForDatetimeLocal(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.telemetryService.createTelemetry({
      assetId: this.form.value.assetId!,
      timestamp: new Date(this.form.value.timestamp!).toISOString(),
      temperature: Number(this.form.value.temperature),
      batteryLevel: Number(this.form.value.batteryLevel),
      vibration: Number(this.form.value.vibration)
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/assets', this.form.value.assetId]);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo registrar la telemetría';
      }
    });
  }

  goBack(): void {
    const assetId = this.form.value.assetId;
    if (assetId) {
      this.router.navigate(['/assets', assetId]);
      return;
    }

    this.router.navigate(['/assets']);
  }
}