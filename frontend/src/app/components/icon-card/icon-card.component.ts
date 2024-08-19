import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../common.service';

@Component({
    selector: 'app-icon-card',
    templateUrl: './icon-card.component.html',
    standalone: true,
    imports: [CommonModule],
})
export class IconCardComponent {
    constructor(protected commonService: CommonService) { }

    @Input() iconClass: string = '';
    @Input() label: string = '';
    @Input() path: string = '';
    @Input() isSvg: boolean = false;
    @Input() viewBox: string = '';
}
