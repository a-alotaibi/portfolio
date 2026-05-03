import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { RevealDirective } from '../../directives/reveal.directive';
import { ProjectModalComponent, ProjectModalData } from '../project-modal/project-modal';

type Platform = 'all' | 'mobile' | 'web';
type Project = ProjectModalData & { platform: Exclude<Platform, 'all'> };

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RevealDirective, ProjectModalComponent],
  template: `
    <section id="projects" class="section">
      <div class="container">
        <h2 class="section-title" reveal="up">{{ lang.t('المشاريع', 'Selected Work') }}</h2>
        <p class="section-sub" reveal="up" [delay]="100">
          {{ lang.t('تطبيقات جوال ومواقع ويب', 'Mobile apps and web platforms') }}
        </p>

        <div class="filters" reveal="up" [delay]="120" role="tablist">
          @for (f of filters; track f.id) {
            <button
              class="filter"
              role="tab"
              [class.active]="active() === f.id"
              [attr.aria-selected]="active() === f.id"
              (click)="setFilter(f.id)">
              <span class="f-icon">{{ f.icon }}</span>
              {{ lang.isAr() ? f.ar : f.en }}
              <span class="f-count">{{ count(f.id) }}</span>
            </button>
          }
        </div>

        <div class="grid">
          @for (p of filtered(); track p.en.title; let i = $index) {
            <article class="app-card"
                     reveal="up"
                     [delay]="i * 100"
                     (mousemove)="onTilt($event)"
                     (mouseleave)="resetTilt($event)">
              <div class="app-row">
                <div class="app-icon" [style.background]="p.gradient">
                  @if (p.image) {
                    <img [src]="p.image" [alt]="lang.isAr() ? p.ar.title : p.en.title" class="icon-img">
                  } @else {
                    <span class="emoji">{{ p.emoji }}</span>
                  }
                  <div class="icon-shine"></div>
                </div>

                <div class="app-info">
                  <h3>{{ lang.isAr() ? p.ar.title : p.en.title }}</h3>
                  <div class="category">{{ lang.isAr() ? p.meta.ar.role : p.meta.en.role }}</div>
                  @if (p.internal) {
                    <div class="badge-internal">
                      <span class="badge-dot"></span>
                      {{ lang.t('داخلي · للموظفين', 'Internal · Employees only') }}
                    </div>
                  } @else {
                    <div class="rating">
                      <span class="stars">★★★★★</span>
                      <span class="rating-count">· {{ p.rating }} ({{ p.reviews }})</span>
                    </div>
                  }
                </div>

                <button class="get-btn" type="button" (click)="open(p)">
                  {{ lang.t('عرض', 'Get') }}
                </button>
              </div>

              <p class="desc">{{ lang.isAr() ? p.ar.desc : p.en.desc }}</p>

              <div class="meta-bar">
                <div class="meta-cell">
                  @if (p.internal) {
                    <small>{{ lang.t('الاستخدام', 'Access') }}</small>
                    <strong>{{ lang.t('داخلي', 'Internal') }}</strong>
                  } @else {
                    <small>{{ lang.t('التقييم', 'Rating') }}</small>
                    <strong>{{ p.rating }}<span class="m-star">★</span></strong>
                  }
                </div>
                <div class="meta-cell">
                  <small>{{ lang.t('العمر', 'Age') }}</small>
                  <strong>{{ p.age }}</strong>
                </div>
                <div class="meta-cell">
                  <small>{{ lang.t('الفئة', 'Category') }}</small>
                  <strong>{{ lang.isAr() ? p.category.ar : p.category.en }}</strong>
                </div>
                <div class="meta-cell">
                  <small>{{ lang.t('الحجم', 'Size') }}</small>
                  <strong>{{ p.size }}</strong>
                </div>
              </div>

              <div class="tags">
                @for (t of p.tags; track t) {
                  <span class="t">{{ t }}</span>
                }
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <app-project-modal
      [project]="selected()"
      [visible]="visible()"
      (closed)="close()" />
  `,
  styles: [`
    .filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 28px;
    }
    .filter {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-dim);
      border-radius: 999px;
      font-weight: 700;
      font-size: 0.9rem;
      transition: transform 0.3s var(--ease-bounce), background 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s;
    }
    .filter:hover {
      transform: translateY(-2px);
      color: var(--text);
      border-color: var(--c2);
    }
    .filter.active {
      background: var(--grad-1);
      color: #fff;
      border-color: transparent;
      box-shadow: 0 14px 30px -12px var(--c2);
    }
    .f-icon { font-size: 1.05rem; }
    .f-count {
      display: inline-grid;
      place-items: center;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      background: rgba(255,255,255,0.18);
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 800;
    }
    .filter:not(.active) .f-count {
      background: var(--surface-strong);
      color: var(--text-mute);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 20px;
    }
    .empty-state {
      grid-column: 1 / -1;
      padding: 60px 24px;
      text-align: center;
      color: var(--text-mute);
      font-weight: 600;
    }

    .app-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 22px;
      transform-style: preserve-3d;
      transition: transform 0.5s var(--ease-out), border-color 0.3s, box-shadow 0.4s;
      will-change: transform;
    }
    .app-card:hover {
      border-color: var(--c2);
      box-shadow: 0 30px 70px -25px rgba(123, 92, 255, 0.5);
    }

    .app-row {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .app-icon {
      width: 72px; height: 72px;
      flex-shrink: 0;
      border-radius: 22%;
      display: grid;
      place-items: center;
      position: relative;
      overflow: hidden;
      box-shadow:
        0 12px 28px -8px rgba(0,0,0,0.4),
        inset 0 1px 1px rgba(255,255,255,0.2);
      transition: transform 0.4s var(--ease-bounce);
    }
    .app-card:hover .app-icon { transform: rotate(-6deg) scale(1.05); }
    .app-icon .emoji {
      font-size: 2.4rem;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
    }
    .app-icon .icon-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .icon-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%);
      pointer-events: none;
    }

    .app-info { flex: 1; min-width: 0; }
    .app-info h3 {
      margin: 0 0 2px;
      font-size: 1.05rem;
      font-weight: 800;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .category {
      color: var(--text-mute);
      font-size: 0.82rem;
      margin-bottom: 4px;
    }
    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.78rem;
      color: var(--text-mute);
    }
    .stars {
      color: var(--c4);
      letter-spacing: 1px;
      font-size: 0.75rem;
    }
    .badge-internal {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(46, 230, 168, 0.12);
      border: 1px solid rgba(46, 230, 168, 0.35);
      border-radius: 999px;
      color: var(--c5);
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .badge-dot {
      width: 6px; height: 6px;
      background: var(--c5);
      border-radius: 50%;
      box-shadow: 0 0 6px var(--c5);
    }

    .get-btn {
      padding: 7px 22px;
      background: var(--surface-strong);
      border: 0;
      color: var(--c3);
      border-radius: 999px;
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 0.02em;
      cursor: pointer;
      transition: transform 0.3s var(--ease-bounce), background 0.3s;
    }
    .get-btn:hover {
      background: var(--c3);
      color: #000;
      transform: scale(1.05);
    }

    .desc {
      margin: 0 0 16px;
      color: var(--text-dim);
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .meta-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      padding: 14px 0;
      margin-bottom: 14px;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
    .meta-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-align: center;
      position: relative;
    }
    .meta-cell + .meta-cell::before {
      content: '';
      position: absolute;
      inset-block: 4px;
      inset-inline-start: 0;
      width: 1px;
      background: var(--border);
    }
    .meta-cell small {
      font-size: 0.65rem;
      color: var(--text-mute);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
    }
    .meta-cell strong {
      font-size: 0.95rem;
      color: var(--text);
      font-weight: 700;
    }
    .m-star {
      color: var(--c4);
      margin-inline-start: 2px;
    }

    .tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .t {
      padding: 4px 10px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.78rem;
      color: var(--text-mute);
      font-weight: 600;
      transition: transform 0.25s var(--ease-bounce), color 0.25s, border-color 0.25s;
    }
    .t:hover {
      transform: translateY(-2px);
      color: var(--text);
      border-color: var(--c2);
    }

    @media (max-width: 600px) {
      .grid { grid-template-columns: 1fr; }
      .meta-bar { grid-template-columns: repeat(2, 1fr); gap: 12px 0; }
      .meta-cell:nth-child(3)::before { display: none; }
      .app-card:hover { transform: none !important; }
    }
  `]
})
export class ProjectsComponent {
  protected lang = inject(LanguageService);

  protected readonly selected = signal<Project | null>(null);
  protected readonly visible = signal(false);
  protected readonly active = signal<Platform>('all');

  protected filters: { id: Platform; ar: string; en: string; icon: string }[] = [
    { id: 'all',    ar: 'الكل',     en: 'All',           icon: '✨' },
    { id: 'mobile', ar: 'تطبيقات',   en: 'Mobile apps',   icon: '📱' },
    { id: 'web',    ar: 'ويب',      en: 'Web',           icon: '🌐' }
  ];

  protected filtered = computed(() => {
    const a = this.active();
    return a === 'all' ? this.projects : this.projects.filter((p) => p.platform === a);
  });

  count(id: Platform): number {
    return id === 'all' ? this.projects.length : this.projects.filter((p) => p.platform === id).length;
  }

  setFilter(id: Platform) { this.active.set(id); }

  protected projects: Project[] = [
    {
      ar: {
        title: 'BEEAH App',
        desc: 'تطبيق داخلي شامل لموظفي الشركة، مربوط مع نظام Odoo ERP — إجازات، استئذانات، تيكتات، متابعة مشاريع، وبصمة دخول وخروج من الجوال.',
        long: 'تطبيق Flutter مخصص لموظفي الشركة، مدمج بالكامل مع نظام Odoo ERP. يوفّر منصة موحّدة لإدارة الإجازات والاستئذانات، رفع تيكتات الدعم، متابعة المشاريع والمهام، وتسجيل بصمة الحضور والانصراف. أداء native على iOS و Android من نفس الكود، مع دعم كامل للوضع الليلي وواجهة عربية/إنجليزية.'
      },
      en: {
        title: 'BEEAH App',
        desc: 'A comprehensive internal employee app integrated with Odoo ERP — leaves, excuses, support tickets, project tracking, and attendance check-in/out from the phone.',
        long: 'A Flutter app for company employees, fully integrated with Odoo ERP. Provides a unified platform for leave and excuse requests, support tickets, project & task tracking, and attendance clocking. Native-feeling performance on iOS and Android from a single codebase, with dark mode and bilingual Arabic/English support.'
      },
      tags: ['Flutter', 'Dart', 'Odoo', 'REST API', 'ERP'],
      gradient: 'linear-gradient(135deg, #2ee6a8 0%, #7b5cff 100%)',
      emoji: '🐝',
      image: 'projects/app_icon.png',
      images: [
        'projects/beeah/01-home.png',
        'projects/beeah/02-menu.png',
        'projects/beeah/03-business.png',
        'projects/beeah/04-calendar.png'
      ],
      link: '#',
      meta: {
        ar: { role: 'مطور Flutter', year: '2025' },
        en: { role: 'Flutter Developer', year: '2025' }
      },
      features: [
        { ar: 'إدارة الإجازات والاستئذانات',                 en: 'Leave & excuse requests' },
        { ar: 'رفع ومتابعة تيكتات الدعم',                    en: 'Submit & track support tickets' },
        { ar: 'متابعة المشاريع والمهام',                     en: 'Project & task tracking' },
        { ar: 'بصمة الحضور والانصراف',                       en: 'Attendance check-in / out' },
        { ar: 'إشعارات فورية للموافقات والتحديثات',          en: 'Real-time approval & update notifications' },
        { ar: 'مزامنة كاملة مع Odoo ERP',                    en: 'Full sync with Odoo ERP' }
      ],
      internal: true,
      age: '—',
      size: '—',
      category: { ar: 'تطبيقات شركات', en: 'Enterprise' },
      platform: 'mobile'
    },
    {
      ar: {
        title: 'ذكِّرني',
        desc: 'تطبيق إسلامي شامل: مواقيت الصلاة بالموقع، الأذكار، المصحف، بوصلة القبلة، وعدّاد التسبيح — كل ما يحتاجه المسلم في تطبيق واحد.',
        long: 'تطبيق Flutter صُمّم للمسلم اليومي. يعرض مواقيت الصلاة بدقة حسب موقعك مع إشعارات لكل صلاة، وبنر للصلاة القادمة مع العد التنازلي. يضم أذكار الصباح والمساء، المصحف الشريف كاملاً، عدّاد التسبيح الرقمي، وبوصلة القبلة باستخدام مستشعر الجهاز. يدعم التقويمين الهجري والميلادي مع وضعَي ليل ونهار.'
      },
      en: {
        title: 'Zakrni',
        desc: 'A complete Islamic companion: location-based prayer times, adhkar, Quran, Qibla compass, and a tasbih counter — everything a Muslim needs in one app.',
        long: "A Flutter app built for the daily Muslim. Accurate location-based prayer times with per-prayer notifications and a next-prayer countdown banner. Includes morning & evening adhkar, the full Quran, a digital tasbih counter, and a Qibla compass using the device sensor. Supports both Hijri & Gregorian calendars with light and dark modes."
      },
      tags: ['Flutter', 'Dart', 'Geolocation', 'Local Notifications', 'Compass', 'Hijri'],
      gradient: 'linear-gradient(135deg, #0E3535 0%, #2ee6a8 100%)',
      emoji: '📿',
      link: '#',
      meta: {
        ar: { role: 'مطور Flutter', year: '2026' },
        en: { role: 'Flutter Developer', year: '2026' }
      },
      features: [
        { ar: 'مواقيت الصلاة دقيقة حسب الموقع',          en: 'Accurate location-based prayer times' },
        { ar: 'إشعارات لكل صلاة',                        en: 'Per-prayer notifications' },
        { ar: 'بنر العد التنازلي للصلاة القادمة',         en: 'Next-prayer countdown banner' },
        { ar: 'أذكار الصباح والمساء',                     en: 'Morning & evening adhkar' },
        { ar: 'المصحف الشريف كامل',                       en: 'Full Quran reader' },
        { ar: 'بوصلة القبلة (مستشعر الجهاز)',             en: 'Qibla compass (device sensor)' },
        { ar: 'عدّاد التسبيح الرقمي',                     en: 'Digital tasbih counter' },
        { ar: 'تقويم هجري وميلادي',                       en: 'Hijri & Gregorian calendars' },
        { ar: 'وضع ليلي ونهاري',                          en: 'Light & dark mode' },
        { ar: 'تشغيل الأذان',                             en: 'Adhan audio playback' }
      ],
      rating: 5.0,
      reviews: 'New',
      age: '4+',
      size: '—',
      category: { ar: 'إسلامي', en: 'Islamic' },
      platform: 'mobile'
    }
  ];

  open(p: Project) {
    this.selected.set(p);
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
    setTimeout(() => this.selected.set(null), 350);
  }

  onTilt(e: MouseEvent) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const max = 4;
    el.style.transform = `perspective(900px) translateY(-4px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  }

  resetTilt(e: MouseEvent) {
    (e.currentTarget as HTMLElement).style.transform = '';
  }
}
