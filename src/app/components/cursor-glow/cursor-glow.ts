import { Component, HostListener, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-cursor-glow',
  standalone: true,
  template: `<div class="cursor-glow" [class.hidden]="hidden()" [style.--cx.px]="x()" [style.--cy.px]="y()"></div>`
})
export class CursorGlowComponent implements OnInit {
  protected readonly x = signal(-1000);
  protected readonly y = signal(-1000);
  protected readonly hidden = signal(true);

  private targetX = -1000;
  private targetY = -1000;
  private rafId?: number;

  ngOnInit() {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    this.hidden.set(false);
    const tick = () => {
      const cx = this.x();
      const cy = this.y();
      this.x.set(cx + (this.targetX - cx) * 0.15);
      this.y.set(cy + (this.targetY - cy) * 0.15);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  @HostListener('window:mousemove', ['$event'])
  onMove(e: MouseEvent) {
    this.targetX = e.clientX;
    this.targetY = e.clientY;
    if (this.hidden()) this.hidden.set(false);
  }

  @HostListener('window:mouseleave')
  onLeave() {
    this.hidden.set(true);
  }
}
