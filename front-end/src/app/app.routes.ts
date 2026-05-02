import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'signin', pathMatch: 'full' },
	{
		path: 'signin',
		loadComponent: () => import('./signin/signin').then((m) => m.Signin)
	},
	{
		path: 'signup',
		loadComponent: () => import('./signup/signup').then((m) => m.Signup)
	},
	{
		path: 'product',
		loadComponent: () => import('./product/product').then((m) => m.Product),
		canActivate: [AuthGuard]
	}
];
