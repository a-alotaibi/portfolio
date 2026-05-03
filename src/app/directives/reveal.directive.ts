import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input
} from '@angular/core';

export type RevealType = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

@Directive({
  selector: '[reveal]',
  standalone: true,
  host: {
    'class': 'reveal',
    '[class.reveal-up]': 'reveal() === "up"',
    '[class.reveal-down]': 'reveal() === "down"',
    '[class.reveal-left]': 'reveal() === "left"',
    '[class.reveal-right]': 'reveal() === "right"',
    '[class.reveal-scale]': 'reveal() === "scale"',
    '[class.reveal-fade]': 'reveal() === "fade"'
  }
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  readonly reveal = input<RevealType>('up');
  readonly delay = input<number>(0);
  readonly threshold = input<number>(0.15);

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    if (this.delay()) node.style.transitionDelay = `${this.delay()}ms`;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('in-view');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: this.threshold(), rootMargin: '0px 0px -60px 0px' }
    );

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
