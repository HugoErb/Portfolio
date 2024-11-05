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
    @Input() buttonDirection: 'left' | 'right' = 'left';
    @Input() isLargeScreenButton: boolean = false;
    @Input() elementsConfig: any;

    @Output() navigate = new EventEmitter<{ resourceType: 'technos' | 'certifs' | 'projects', direction: 'left' | 'right' }>();

    onClick() {
        this.navigate.emit({ resourceType: this.resourceType, direction: this.buttonDirection });
    }
}
