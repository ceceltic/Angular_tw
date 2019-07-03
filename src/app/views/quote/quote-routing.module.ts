import { Routes } from '@angular/router';
import { QuoteinputComponent } from './quoteinput/quoteinput.component';

export const QuoteRoutingModule: Routes = [
/*   {
    path: '',
    redirectTo: 'premium-list',
    pathMatch: 'full'
  }, */
  {
    path: '',
    component: QuoteinputComponent,
    data: { title: "", breadcrumb: "" }
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];
