import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  { path: 'rights-request-form', loadChildren: () => import('./rights-request-form/rights-request-form.module').then((m) => m.RightsRequestFormModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule) },
  { path: 'terms-and-conditions', loadChildren: () => import('./terms/terms.module').then((m) => m.TermsModule) },
];
