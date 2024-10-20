import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../common.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [],
  templateUrl: './project.component.html'
})
export class ProjectComponent {
    @Input() imgPath: string = '';
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() link: string = '';
}
