import { Routes } from '@angular/router';
import { PremiumListComponent } from './premium-list/premium-list.component';

export const QuotecompareRoutingModule: Routes = [
/*   {
    path: '',
    redirectTo: 'premium-list',
    pathMatch: 'full'
  }, */
  {
    path: '',
    component: PremiumListComponent,
    data: { title: "", breadcrumb: "" }
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];