import { Component, Input } from '@angular/core';

import { CommonService } from '../../common.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
    selector: 'app-technology',
    templateUrl: './technology.component.html',
    imports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TechnologyComponent {
    constructor(protected commonService: CommonService) { }

    @Input() iconClass: string = '';
    @Input() label: string = '';
    @Input() description: string = '';
}
