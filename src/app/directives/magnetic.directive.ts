import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[magnetic]',
  standalone: true
})
export class MagneticDirective {
  readonly magnetic = input<number>(0.35);

  private el = inject(ElementRef<HTMLElement>);

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent) {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * this.magnetic();
    const dy = (e.clientY - (rect.top + rect.height / 2)) * this.magnetic();
    node.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
  }

  @HostListener('mouseleave')
  onLeave() {
    this.el.nativeElement.style.transform = '';
  }
}
