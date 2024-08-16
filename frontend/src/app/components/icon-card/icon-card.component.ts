import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon-card',
  templateUrl: './icon-card.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class IconCardComponent {
  @Input() iconClass: string = '';
  @Input() label: string = '';
  @Input() isSvg: boolean = false;
  @Input() viewBox: number = 512;
}
