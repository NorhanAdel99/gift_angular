import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/auth/login/login';
import { MainLayoutComponent } from './layouts/main-layout';
import { AuthLayoutComponent } from './layouts/auth';
import { Register } from './pages/auth/register/register';
import { Otp } from './pages/auth/otp/otp';

import { guestGuard } from './guard/guest-guard';


export const routes: Routes = [
    // all pages 
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent }
        ]
    },

    // login page 
    {
        path: 'auth',
        component: AuthLayoutComponent,
        canActivateChild: [guestGuard],
        children: [
            { path: 'login', component: Login },
            { path: 'register', component: Register },
            { path: 'otp', component: Otp }
        ],
    }
    ,
    {
        path: '**',
        component: NotFound
    },





];
