import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AssetsListComponent } from './features/assets/assets-list/assets-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'assets', component: AssetsListComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];