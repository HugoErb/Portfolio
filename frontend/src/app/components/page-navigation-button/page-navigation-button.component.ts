import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-page-navigation-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './page-navigation-button.component.html',
})
export class PageNavigationButtonComponent {

    @Input() resourceType: 'projects' | 'technos' | 'certifs' = 'projects';
    @Input() elementsConfig: any;
    @Output() navigateLeft = new EventEmitter<'projects' | 'technos' | 'certifs'>();
    @Output() navigateRight = new EventEmitter<'projects' | 'technos' | 'certifs'>();

    /**
     * Méthode déclenchée au clic sur le bouton gauche.
     * Émet l'événement `navigateLeft` avec `resourceType`.
     */
    onNavigateLeft() {
        this.navigateLeft.emit(this.resourceType);
    }

    /**
     * Méthode déclenchée au clic sur le bouton droit.
     * Émet l'événement `navigateRight` avec `resourceType`.
     */
    onNavigateRight() {
        this.navigateRight.emit(this.resourceType);
    }
}
