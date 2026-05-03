import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input
} from '@angular/core';

@Directive({
  selector: '[typewriter]',
  standalone: true
})
export class TypewriterDirective implements OnInit, OnDestroy {
  readonly typewriter = input.required<string[]>();
  readonly typeSpeed = input<number>(70);
  readonly eraseSpeed = input<number>(40);
  readonly holdMs = input<number>(1400);

  private el = inject(ElementRef<HTMLElement>);
  private timer?: ReturnType<typeof setTimeout>;
  private idx = 0;
  private chars = 0;
  private erasing = false;

  constructor() {
    effect(() => {
      // restart when list changes (e.g. language toggle)
      this.typewriter();
      this.reset();
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.el.nativeElement.textContent = this.typewriter()[0] ?? '';
      return;
    }
  }

  ngOnDestroy() {
    if (this.timer) clearTimeout(this.timer);
  }

  private reset() {
    if (this.timer) clearTimeout(this.timer);
    this.idx = 0;
    this.chars = 0;
    this.erasing = false;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.el.nativeElement.textContent = this.typewriter()[0] ?? '';
      return;
    }
    this.tick();
  }

  private tick = () => {
    const list = this.typewriter();
    if (!list || !list.length) return;
    const word = list[this.idx % list.length];

    if (!this.erasing) {
      this.chars++;
      this.el.nativeElement.textContent = word.slice(0, this.chars);
      if (this.chars >= word.length) {
        this.erasing = true;
        this.timer = setTimeout(this.tick, this.holdMs());
        return;
      }
      this.timer = setTimeout(this.tick, this.typeSpeed());
    } else {
      this.chars--;
      this.el.nativeElement.textContent = word.slice(0, this.chars);
      if (this.chars <= 0) {
        this.erasing = false;
        this.idx = (this.idx + 1) % list.length;
        this.timer = setTimeout(this.tick, 240);
        return;
      }
      this.timer = setTimeout(this.tick, this.eraseSpeed());
    }
  };
}
