import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-svg-page-navigation-button',
    imports: [],
    templateUrl: './svg-page-navigation-button.component.html'
})
export class SvgPageNavigationButtonComponent {
    @Input() buttonDirection: 'left' | 'right' = 'left';
}
