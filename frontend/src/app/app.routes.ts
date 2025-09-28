import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LegalInformationComponent } from './legal-information/legal-information.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'legal-information', component: LegalInformationComponent },
];
