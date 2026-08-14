import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    /**
    * Affiche une modale spécifiée par son identifiant.
    *
    * @param {string} id - L'identifiant de l'élément modal à afficher.
    */
    showModal(id: string): void {
        const modal = document.getElementById(id) as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    }
}
