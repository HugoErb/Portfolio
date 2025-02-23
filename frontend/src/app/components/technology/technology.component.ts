import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../common.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
    selector: 'app-technology',
    standalone: true,
    templateUrl: './technology.component.html',
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TechnologyComponent {
    constructor(protected commonService: CommonService) { }

    @Input() iconClass: string = '';
    @Input() label: string = '';
    @Input() description: string = '';
}
