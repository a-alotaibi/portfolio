import {
  Component,
  HostListener,
  computed,
  effect,
  inject,
  input,
  output
} from '@angular/core';
import { LanguageService } from '../../services/language.service';

export interface ProjectModalData {
  ar: { title: string; desc: string; long?: string };
  en: { title: string; desc: string; long?: string };
  tags: string[];
  gradient: string;
  emoji: string;
  link?: string;
  features: { ar: string; en: string }[];
  meta: { ar: { role: string; year: string }; en: { role: string; year: string } };
  rating: number;
  reviews: string;
  age: string;
  size: string;
  category: { ar: string; en: string };
}

@Component({
  selector: 'app-project-modal',
  standalone: true,
  template: `
    @if (project()) {
      <div class="backdrop" [class.open]="visible()" (click)="onBackdropClick($event)">
        <div class="dialog" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
          <button class="close" (click)="closed.emit()" [attr.aria-label]="lang.t('إغلاق', 'Close')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <div class="hero-cover" [style.background]="project()!.gradient">
            <div class="cover-noise"></div>
            <div class="cover-glow"></div>
          </div>

          <header class="app-header">
            <div class="app-icon" [style.background]="project()!.gradient">
              <span class="emoji">{{ project()!.emoji }}</span>
              <div class="icon-shine"></div>
            </div>
            <div class="title-block">
              <h2>{{ lang.isAr() ? project()!.ar.title : project()!.en.title }}</h2>
              <div class="subtitle">{{ lang.isAr() ? project()!.meta.ar.role : project()!.meta.en.role }}</div>
              <div class="actions-row">
                @if (project()!.link && project()!.link !== '#') {
                  <a class="get-btn" [href]="project()!.link" target="_blank" rel="noopener">
                    {{ lang.t('فتح', 'Open') }}
                  </a>
                } @else {
                  <span class="get-btn disabled">
                    {{ lang.t('قريباً', 'Soon') }}
                  </span>
                }
                <button class="share-btn" (click)="closed.emit()" [attr.aria-label]="lang.t('إغلاق', 'Close')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <div class="meta-bar">
            
            <div class="meta-cell">
              <small>{{ lang.t('التقييم', 'Rating') }}</small>
              <strong>{{ project()!.rating }}<span class="m-star">★</span></strong>
              <span class="meta-sub">{{ project()!.reviews }} {{ lang.t('تقييم', 'Ratings') }}</span>
            </div>
            <div class="meta-cell">
              <small>{{ lang.t('العمر', 'Age') }}</small>
              <strong>{{ project()!.age }}</strong>
              <span class="meta-sub">{{ lang.t('سنوات', 'Years') }}</span>
            </div>
            <div class="meta-cell">
              <small>{{ lang.t('الفئة', 'Category') }}</small>
              <strong class="cat">{{ lang.isAr() ? project()!.category.ar : project()!.category.en }}</strong>
              <span class="meta-sub">App</span>
            </div>
            <div class="meta-cell">
              <small>{{ lang.t('الحجم', 'Size') }}</small>
              <strong>{{ project()!.size }}</strong>
              <span class="meta-sub">{{ lang.t('تحميل', 'Download') }}</span>
            </div>
          </div>

          <div class="screenshots-wrap">
            <h3 class="ss-title">{{ lang.t('لقطات من التطبيق', 'Preview') }}</h3>
            <div class="screenshots">
              <div class="ss" [style.background]="project()!.gradient">
                <div class="ss-status"><span>9:41</span><span class="ss-bat"></span></div>
                <div class="ss-emoji">{{ project()!.emoji }}</div>
                <div class="ss-title-line"></div>
                <div class="ss-line"></div>
                <div class="ss-card"></div>
                <div class="ss-card"></div>
              </div>
              <div class="ss ss-dark">
                <div class="ss-status"><span>9:41</span><span class="ss-bat"></span></div>
                <div class="ss-row"><span class="ss-avatar" [style.background]="project()!.gradient"></span><span class="ss-line w70"></span></div>
                <div class="ss-row"><span class="ss-avatar" [style.background]="project()!.gradient"></span><span class="ss-line w50"></span></div>
                <div class="ss-row"><span class="ss-avatar" [style.background]="project()!.gradient"></span><span class="ss-line w60"></span></div>
                <div class="ss-row"><span class="ss-avatar" [style.background]="project()!.gradient"></span><span class="ss-line w40"></span></div>
                <div class="ss-row"><span class="ss-avatar" [style.background]="project()!.gradient"></span><span class="ss-line w70"></span></div>
              </div>
              <div class="ss" [style.background]="project()!.gradient">
                <div class="ss-status"><span>9:41</span><span class="ss-bat"></span></div>
                <div class="ss-grid">
                  <div class="ss-tile"></div><div class="ss-tile"></div>
                  <div class="ss-tile"></div><div class="ss-tile"></div>
                  <div class="ss-tile"></div><div class="ss-tile"></div>
                </div>
              </div>
              <div class="ss ss-dark">
                <div class="ss-status"><span>9:41</span><span class="ss-bat"></span></div>
                <div class="ss-hero-card" [style.background]="project()!.gradient">
                  <div class="ss-emoji-sm">{{ project()!.emoji }}</div>
                </div>
                <div class="ss-line w60"></div>
                <div class="ss-line w40 dim"></div>
                <div class="ss-btn" [style.background]="project()!.gradient"></div>
                <div class="ss-line w50 dim"></div>
                <div class="ss-line w70 dim"></div>
              </div>
            </div>
          </div>

          <div class="content">
            <p class="desc">{{ lang.isAr() ? project()!.ar.desc : project()!.en.desc }}</p>

            @if (longText()) {
              <p class="long">{{ longText() }}</p>
            }

            @if (project()!.features.length) {
              <h3>{{ lang.t('أبرز المزايا', "What's great") }}</h3>
              <ul class="features">
                @for (f of project()!.features; track f.en) {
                  <li>
                    <span class="check">✓</span>
                    <span>{{ lang.isAr() ? f.ar : f.en }}</span>
                  </li>
                }
              </ul>
            }

            <h3>{{ lang.t('التقنيات المستخدمة', 'Built with') }}</h3>
            <div class="tags">
              @for (t of project()!.tags; track t) {
                <span class="t">{{ t }}</span>
              }
            </div>

            <div class="info-rows">
              <div class="info-row">
                <span>{{ lang.t('المطور', 'Developer') }}</span>
                <span class="info-val">{{ lang.t('عبدالعزيز', 'Abdulaziz') }}</span>
              </div>
              <div class="info-row">
                <span>{{ lang.t('سنة الإصدار', 'Released') }}</span>
                <span class="info-val">{{ lang.isAr() ? project()!.meta.ar.year : project()!.meta.en.year }}</span>
              </div>
              <div class="info-row">
                <span>{{ lang.t('اللغات', 'Languages') }}</span>
                <span class="info-val">{{ lang.t('العربية، الإنجليزية', 'Arabic, English') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 5, 15, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: grid;
      place-items: center;
      padding: 24px;
      z-index: 100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s var(--ease-out);
    }
    .backdrop.open { opacity: 1; pointer-events: auto; }

    .dialog {
      width: 100%;
      max-width: 720px;
      max-height: 90vh;
      overflow-y: auto;
      background: linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      position: relative;
      box-shadow: 0 60px 120px -20px rgba(0,0,0,0.6);
      transform: scale(0.92) translateY(20px);
      opacity: 0;
      transition: transform 0.45s var(--ease-bounce), opacity 0.35s var(--ease-out);
    }
    .backdrop.open .dialog {
      transform: scale(1) translateY(0);
      opacity: 1;
    }

    .dialog::-webkit-scrollbar { width: 8px; }
    .dialog::-webkit-scrollbar-track { background: transparent; }
    .dialog::-webkit-scrollbar-thumb { background: var(--c2); border-radius: 8px; }

    .close {
      position: absolute;
      top: 16px;
      inset-inline-end: 16px;
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border);
      color: #fff;
      border-radius: 50%;
      z-index: 5;
      transition: transform 0.3s var(--ease-bounce), background 0.3s, color 0.3s;
    }
    .close:hover {
      background: var(--c1);
      transform: rotate(90deg) scale(1.1);
      border-color: transparent;
    }

    /* Hero gradient cover */
    .hero-cover {
      position: relative;
      height: 140px;
      overflow: hidden;
    }
    .cover-noise {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
        radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px);
      background-size: 18px 18px, 22px 22px;
      background-position: 0 0, 9px 11px;
      mix-blend-mode: overlay;
      opacity: 0.5;
    }
    .cover-glow {
      position: absolute;
      inset-block-end: -100px;
      inset-inline-start: -50px;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%);
      pointer-events: none;
    }

    /* App Store style header */
    .app-header {
      display: flex;
      gap: 16px;
      padding: 0 28px;
      margin-top: -40px;
      position: relative;
      z-index: 2;
      align-items: flex-end;
      margin-bottom: 24px;
    }

    .app-icon {
      width: 110px;
      height: 110px;
      flex-shrink: 0;
      border-radius: 24%;
      display: grid;
      place-items: center;
      position: relative;
      overflow: hidden;
      box-shadow:
        0 20px 50px -10px rgba(0,0,0,0.6),
        inset 0 1px 1px rgba(255,255,255,0.2);
    }
    .app-icon .emoji {
      font-size: 3.5rem;
      filter: drop-shadow(0 4px 16px rgba(0,0,0,0.3));
    }
    .icon-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%);
      pointer-events: none;
    }

    .title-block {
      flex: 1;
      min-width: 0;
      padding-bottom: 6px;
    }
    h2 {
      margin: 0 0 4px;
      font-size: 1.6rem;
      font-weight: 800;
      line-height: 1.2;
      color: var(--text);
    }
    .subtitle {
      color: var(--text-mute);
      font-size: 0.92rem;
      margin-bottom: 10px;
    }
    .actions-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .get-btn {
      padding: 7px 24px;
      background: var(--c3);
      color: #000;
      border: 0;
      border-radius: 999px;
      font-weight: 800;
      font-size: 0.9rem;
      letter-spacing: 0.02em;
      cursor: pointer;
      transition: transform 0.3s var(--ease-bounce), background 0.3s;
      display: inline-block;
    }
    .get-btn:hover { transform: scale(1.05); background: #fff; }
    .get-btn.disabled {
      background: var(--surface-strong);
      color: var(--text-mute);
      cursor: not-allowed;
    }
    .share-btn {
      width: 32px; height: 32px;
      display: grid;
      place-items: center;
      background: var(--surface-strong);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 50%;
      cursor: pointer;
      transition: 0.3s;
    }
    .share-btn:hover { background: var(--surface); transform: scale(1.1); }

    /* Stats bar */
    .meta-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      padding: 14px 28px 22px;
      border-bottom: 1px solid var(--border);
    }
    .meta-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-align: center;
      position: relative;
      padding: 0 12px;
    }
    .meta-cell + .meta-cell::before {
      content: '';
      position: absolute;
      inset-block: 6px;
      inset-inline-start: 0;
      width: 1px;
      background: var(--border);
    }
    .meta-cell small {
      font-size: 0.7rem;
      color: var(--text-mute);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
    }
    .meta-cell strong {
      font-size: 1.05rem;
      color: var(--text);
      font-weight: 800;
    }
    .meta-cell strong.cat {
      font-size: 0.85rem;
      line-height: 1.2;
      margin-top: 4px;
    }
    .meta-cell .meta-sub {
      font-size: 0.65rem;
      color: var(--text-mute);
      font-weight: 600;
    }
    .m-star { color: var(--c4); margin-inline-start: 2px; }

    /* ---------- Screenshots carousel ---------- */
    .screenshots-wrap {
      padding: 22px 0 6px;
      border-bottom: 1px solid var(--border);
    }
    .ss-title {
      margin: 0 28px 14px;
      font-size: 1rem;
      font-weight: 800;
      color: var(--text);
    }
    .screenshots {
      display: flex;
      gap: 14px;
      padding: 0 28px 22px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: thin;
    }
    .screenshots::-webkit-scrollbar { height: 6px; }
    .screenshots::-webkit-scrollbar-thumb { background: var(--c2); border-radius: 4px; }
    .screenshots::-webkit-scrollbar-track { background: transparent; }

    .ss {
      flex-shrink: 0;
      width: 160px;
      aspect-ratio: 9 / 19;
      border-radius: 22px;
      padding: 14px 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-snap-align: start;
      position: relative;
      overflow: hidden;
      box-shadow:
        0 0 0 2px rgba(255,255,255,0.1),
        0 24px 50px -10px rgba(0,0,0,0.5);
      transition: transform 0.4s var(--ease-out);
    }
    .ss:hover { transform: translateY(-6px) scale(1.03); }
    .ss-dark { background: linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%); }

    .ss-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.6rem;
      font-weight: 800;
      color: #fff;
      padding: 0 4px;
      margin-bottom: 6px;
    }
    .ss-bat {
      width: 16px; height: 7px;
      background: #fff;
      border-radius: 2px;
      position: relative;
    }
    .ss-bat::after {
      content: '';
      position: absolute;
      inset-inline-end: -2px;
      top: 2px;
      width: 1.5px; height: 3px;
      background: #fff;
      border-radius: 0 1px 1px 0;
    }

    .ss-emoji {
      font-size: 2.5rem;
      text-align: center;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
      margin: 8px 0 4px;
    }
    .ss-emoji-sm {
      font-size: 1.6rem;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
    }

    .ss-title-line {
      height: 8px;
      width: 70%;
      margin: 0 auto;
      background: rgba(255,255,255,0.7);
      border-radius: 4px;
    }
    .ss-line {
      height: 6px;
      background: rgba(255,255,255,0.6);
      border-radius: 3px;
      margin: 0 auto;
      width: 80%;
    }
    .ss-line.w40 { width: 40%; }
    .ss-line.w50 { width: 50%; }
    .ss-line.w60 { width: 60%; }
    .ss-line.w70 { width: 70%; }
    .ss-line.dim { opacity: 0.4; height: 5px; }
    .ss-dark .ss-line { background: rgba(255,255,255,0.85); }

    .ss-card {
      height: 36px;
      background: rgba(255,255,255,0.18);
      backdrop-filter: blur(8px);
      border-radius: 8px;
      margin-top: 6px;
    }

    .ss-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 4px;
    }
    .ss-row .ss-line { margin: 0; }
    .ss-avatar {
      width: 22px; height: 22px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .ss-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding: 4px;
    }
    .ss-tile {
      aspect-ratio: 1;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(6px);
      border-radius: 12px;
    }

    .ss-hero-card {
      height: 60px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      margin-bottom: 4px;
    }
    .ss-btn {
      height: 22px;
      border-radius: 999px;
      margin: 4px auto;
      width: 60%;
      box-shadow: 0 4px 14px -4px rgba(0,0,0,0.3);
    }

    .content { padding: 24px 28px 28px; }

    h3 {
      margin: 24px 0 12px;
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--text);
    }
    h3:first-of-type { margin-top: 0; }

    .desc {
      margin: 0 0 14px;
      color: var(--text-dim);
      line-height: 1.7;
      font-size: 1rem;
    }
    .long {
      margin: 0;
      color: var(--text-dim);
      line-height: 1.85;
      font-size: 0.95rem;
    }

    .features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 8px;
    }
    .features li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text-dim);
      font-size: 0.93rem;
      transition: transform 0.25s var(--ease-out), border-color 0.3s, color 0.3s;
    }
    .features li:hover {
      transform: translateX(4px);
      border-color: var(--c5);
      color: var(--text);
    }
    html[dir='rtl'] .features li:hover { transform: translateX(-4px); }
    .check {
      width: 22px; height: 22px;
      display: grid;
      place-items: center;
      flex-shrink: 0;
      border-radius: 50%;
      background: var(--c5);
      color: #000;
      font-weight: 900;
      font-size: 0.7rem;
    }

    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .t {
      padding: 6px 12px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-dim);
      transition: transform 0.25s var(--ease-bounce), background 0.25s, color 0.25s;
    }
    .t:hover {
      transform: translateY(-2px);
      background: var(--c2);
      color: #fff;
      border-color: transparent;
    }

    .info-rows {
      margin-top: 24px;
      border-top: 1px solid var(--border);
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid var(--border);
      font-size: 0.92rem;
    }
    .info-row span:first-child { color: var(--text-mute); }
    .info-val { color: var(--text); font-weight: 600; }

    @media (max-width: 600px) {
      .app-header { padding: 0 20px; gap: 12px; }
      .app-icon { width: 80px; height: 80px; }
      .app-icon .emoji { font-size: 2.5rem; }
      h2 { font-size: 1.3rem; }
      .meta-bar { padding: 12px 16px 18px; }
      .meta-cell { padding: 0 6px; }
      .meta-cell strong { font-size: 0.85rem; }
      .meta-cell strong.cat { font-size: 0.72rem; }
      .content { padding: 20px; }
    }
  `]
})
export class ProjectModalComponent {
  protected lang = inject(LanguageService);

  readonly project = input<ProjectModalData | null>(null);
  readonly visible = input<boolean>(false);
  readonly closed = output<void>();

  protected readonly longText = computed(() => {
    const p = this.project();
    if (!p) return '';
    return this.lang.isAr() ? (p.ar.long ?? '') : (p.en.long ?? '');
  });

  constructor() {
    effect(() => {
      if (typeof document === 'undefined') return;
      document.body.style.overflow = this.visible() ? 'hidden' : '';
    });
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.visible()) this.closed.emit();
  }

  onBackdropClick(_e: MouseEvent) {
    this.closed.emit();
  }
}
