export * from './assets.service';
import { AssetsService } from './assets.service';
export * from './auth.service';
import { AuthService } from './auth.service';
export * from './telemetry.service';
import { TelemetryService } from './telemetry.service';
export const APIS = [AssetsService, AuthService, TelemetryService];
