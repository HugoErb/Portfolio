import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-project',
    imports: [],
    templateUrl: './project.component.html'
})
export class ProjectComponent {
    @Input() imgPath: string = '';
    @Input() srcSet: string = '';
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() link: string = '';
}
