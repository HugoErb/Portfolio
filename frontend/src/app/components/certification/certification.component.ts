import { Component, Input } from '@angular/core';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
    selector: 'app-certification',
    templateUrl: './certification.component.html',
    imports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CertificationComponent {
    constructor() { }

    @Input() imgPath: string = '';
    @Input() label: string = '';
    @Input() link: string = '';
}

