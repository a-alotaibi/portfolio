import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input
} from '@angular/core';

@Directive({
  selector: '[countUp]',
  standalone: true
})
export class CountUpDirective implements AfterViewInit, OnDestroy {
  readonly countUp = input.required<number>();
  readonly duration = input<number>(1600);
  readonly suffix = input<string>('');

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private rafId?: number;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    node.textContent = '0' + this.suffix();

    const start = () => {
      const target = this.countUp();
      const duration = this.duration();
      const startTime = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(eased * target);
        node.textContent = value + this.suffix();
        if (t < 1) this.rafId = requestAnimationFrame(tick);
      };

      this.rafId = requestAnimationFrame(tick);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = this.countUp() + this.suffix();
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      start();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3 }
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
