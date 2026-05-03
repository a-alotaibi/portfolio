import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ActiveSectionService {
  readonly active = signal<string>('home');
  readonly scrollProgress = signal<number>(0);

  private observer?: IntersectionObserver;
  private scrollListener?: () => void;
  private rafId?: number;

  init() {
    if (typeof window === 'undefined') return;

    const ids = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) this.active.set(visible.target.id);
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: '-80px 0px -40% 0px' }
    );

    queueMicrotask(() => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) this.observer!.observe(el);
      }
    });

    const onScroll = () => {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        this.scrollProgress.set(max > 0 ? (h.scrollTop / max) * 100 : 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    this.scrollListener = onScroll;
    onScroll();
  }
}
