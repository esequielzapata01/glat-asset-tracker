import { Injectable, inject } from '@angular/core';

import { TelemetryService as GeneratedTelemetryService } from '../../api-client/api/telemetry.service';
import { CreateTelemetryLog } from '../../api-client/model/createTelemetryLog';
import { TelemetryLog } from '../../api-client/model/telemetryLog';

export type { CreateTelemetryLog, TelemetryLog };

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private generatedTelemetryService = inject(GeneratedTelemetryService);

  createTelemetry(payload: CreateTelemetryLog) {
    return this.generatedTelemetryService.telemetryPost(payload);
  }

  getTelemetryByAsset(assetId: string) {
    return this.generatedTelemetryService.telemetryAssetIdGet(assetId);
  }

  getAllTelemetry() {
    return this.generatedTelemetryService.telemetryGet();
  }
}