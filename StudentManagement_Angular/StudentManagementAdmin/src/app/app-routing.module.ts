import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { PlacementsComponent } from './placements/placements.component';


const routes: Routes = [
{ path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'admin-login', loadChildren: () => import('./admin-login/admin-login.module').then(m => m.AdminLoginModule) },
  
  { path: 'placements', component: PlacementsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'admin-login', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin-login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
