import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const AuthRoutingModule: Routes = [
/*   {
    path: '',
    redirectTo: 'premium-list',
    pathMatch: 'full'
  }, */
  {
    path: 'login',
    component: LoginComponent,
    data: { title: "Login", breadcrumb: "" }
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];

