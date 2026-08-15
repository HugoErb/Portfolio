import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-legal-information',
    imports: [],
    templateUrl: './legal-information.component.html'
})
export class LegalInformationComponent {

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) {
    }

    protected readonly personalDataOpened = this.activatedRoute.snapshot.fragment === 'personal-data';

    /**
    * Navigue vers un composant spécifié et, optionnellement, fait défiler vers une section au sein de ce composant.
    *
    * @param {string} component - Le nom du composant vers lequel naviguer. Cela doit être le chemin ou
    *                             la route associée au composant cible dans la configuration de routage Angular.
    * @param {string} section - La section au sein du composant cible vers laquelle l'utilisateur doit être redirigé.
    *                           Ce paramètre est optionnel et est utilisé pour indiquer une section ou
    *                           un fragment spécifique au sein du composant.
    */
    navigateTo(component: string, section: string) {
        this.router.navigate([component, { redirectionSection: section }]);
    }

}
