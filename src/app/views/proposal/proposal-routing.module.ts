import { Routes } from '@angular/router';
import { ProposalinputComponent } from './proposalinput/proposalinput.component';

export const ProposalRoutingModule: Routes = [
/*   {
    path: '',
    redirectTo: 'premium-list',
    pathMatch: 'full'
  }, */
  {
    path: '',
    component: ProposalinputComponent,
    data: { title: "", breadcrumb: "" }
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];

