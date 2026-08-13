import { Routes } from '@angular/router';
export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', loadComponent: () => import('./home/home.component').then((module) => module.HomeComponent) },
	{
		path: 'legal-information',
		loadComponent: () => import('./legal-information/legal-information.component').then((module) => module.LegalInformationComponent),
	},
];
