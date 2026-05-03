import { Component, computed, inject } from '@angular/core';
import { ActiveSectionService } from '../../services/active-section.service';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  template: `
    <button
      type="button"
      class="btn"
      [class.show]="visible()"
      (click)="toTop()"
      [attr.aria-label]="'Scroll to top'"
      tabindex="0">
      <svg class="ring" viewBox="0 0 36 36" width="48" height="48">
        <circle cx="18" cy="18" r="16" stroke="rgba(255,255,255,0.12)" stroke-width="2.5" fill="none"/>
        <circle
          class="prog"
          cx="18" cy="18" r="16"
          stroke="url(#st-grad)"
          stroke-width="2.5"
          fill="none"
          stroke-linecap="round"
          [attr.stroke-dasharray]="dash"
          [attr.stroke-dashoffset]="offset()" />
        <defs>
          <linearGradient id="st-grad" x1="0" y1="0" x2="36" y2="36">
            <stop offset="0%" stop-color="#ff4ecd"/>
            <stop offset="50%" stop-color="#7b5cff"/>
            <stop offset="100%" stop-color="#00d4ff"/>
          </linearGradient>
        </defs>
      </svg>
      <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  `,
  styles: [`
    .btn {
      position: fixed;
      bottom: 22px;
      inset-inline-end: 22px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      background: var(--bg-2);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 18px 36px -12px rgba(0,0,0,0.5);
      opacity: 0;
      transform: translateY(20px) scale(0.85);
      pointer-events: none;
      transition: opacity 0.35s var(--ease-out), transform 0.4s var(--ease-bounce), background 0.3s, border-color 0.3s;
      z-index: 50;
    }
    .btn.show {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .btn:hover {
      background: var(--surface-strong);
      border-color: var(--c2);
      transform: translateY(-3px) scale(1.05);
    }
    .ring {
      position: absolute;
      inset: 0;
      transform: rotate(-90deg);
    }
    .prog {
      transition: stroke-dashoffset 0.15s linear;
    }
    .arrow { position: relative; z-index: 1; }
  `]
})
export class ScrollTopComponent {
  protected active = inject(ActiveSectionService);
  protected readonly dash = 100; // 2*PI*16 ≈ 100.53 — close enough
  protected visible = computed(() => this.active.scrollProgress() > 12);
  protected offset = computed(() => this.dash * (1 - this.active.scrollProgress() / 100));

  toTop() {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
