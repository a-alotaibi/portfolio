import { Component, inject } from '@angular/core';
import { ActiveSectionService } from '../../services/active-section.service';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  template: `<div class="bar" [style.width.%]="active.scrollProgress()"></div>`,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      inset-inline-start: 0;
      width: 100%;
      height: 3px;
      z-index: 60;
      pointer-events: none;
    }
    .bar {
      height: 100%;
      background: linear-gradient(90deg, #ff4ecd 0%, #7b5cff 50%, #00d4ff 100%);
      box-shadow: 0 0 12px rgba(123, 92, 255, 0.6);
      transition: width 0.1s linear;
      will-change: width;
    }
  `]
})
export class ScrollProgressComponent {
  protected active = inject(ActiveSectionService);
}
