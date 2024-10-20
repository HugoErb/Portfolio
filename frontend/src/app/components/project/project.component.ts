import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
    selector: 'app-project',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './project.component.html'
})
export class ProjectComponent {
    @Input() imgPath: string = '';
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() link: string = '';
}
