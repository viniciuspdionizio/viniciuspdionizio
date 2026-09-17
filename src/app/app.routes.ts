import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/home/home.component') },
    { path: 'admin/visitors', loadComponent: () => import('./pages/admin-visitors/admin-visitors.component') },
    { path: '**', redirectTo: '' },
];
