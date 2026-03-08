import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AssetsListComponent } from './features/assets/assets-list/assets-list.component';
import { AssetCreateComponent } from './features/assets/asset-create/asset-create.component';
import { AssetDetailComponent } from './features/assets/asset-detail/asset-detail.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { TelemetryCreateComponent } from './features/telemetry/telemetry-create/telemetry-create.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'assets', component: AssetsListComponent, canActivate: [authGuard] },
  { path: 'assets/new', component: AssetCreateComponent, canActivate: [authGuard] },
  { path: 'assets/:id', component: AssetDetailComponent, canActivate: [authGuard] },
  { path: 'telemetry/new', component: TelemetryCreateComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];