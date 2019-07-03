import { Routes } from '@angular/router';
import { ProposalconfirmationdisplayComponent } from './proposalconfirmationdisplay/proposalconfirmationdisplay.component';

export const ProposalconfirmationRoutingModule: Routes = [
/*   {
    path: '',
    redirectTo: 'premium-list',
    pathMatch: 'full'
  }, */
  {
    path: '',
    component: ProposalconfirmationdisplayComponent,
    data: { title: "", breadcrumb: "" }
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];
