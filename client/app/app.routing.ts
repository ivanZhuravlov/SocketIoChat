import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent }      from './app.auth.component';
import { UsersListComponent } from './app.users-list.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/auth',
        pathMatch : 'full'
    },
    {
        path: 'auth',
        component: AuthComponent
    },
    {
        path: 'users',
        component: UsersListComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);