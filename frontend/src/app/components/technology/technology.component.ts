import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonService } from '../../common.service';

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
