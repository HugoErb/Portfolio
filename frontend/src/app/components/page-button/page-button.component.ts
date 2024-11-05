import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-button',
  standalone: true,
  imports: [],
  templateUrl: './page-button.component.html'
})
export class PageButtonComponent {
    @Input() buttonDirection: string = '';
    @Input() resourceType: 'projects' | 'technos' | 'certifs' = 'projects';
}
