import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{
		path: 'legal-information',
		loadComponent: () => import('./legal-information/legal-information.component').then((module) => module.LegalInformationComponent),
	},
];
