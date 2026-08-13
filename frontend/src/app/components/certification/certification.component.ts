import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-certification',
    templateUrl: './certification.component.html',
    imports: []
})
export class CertificationComponent {
    @Input() imgPath: string = '';
    @Input() srcSet: string = '';
    @Input() label: string = '';
    @Input() link: string = '';
}

