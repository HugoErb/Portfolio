import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../common.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
    selector: 'app-certification',
    standalone: true,
    templateUrl: './certification.component.html',
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CertificationComponent {
    constructor(protected commonService: CommonService) { }

    @Input() imgPath: string = '';
    @Input() label: string = '';
    @Input() link: string = '';
}
