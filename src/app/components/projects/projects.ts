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
                  <span class="emoji">{{ p.emoji }}</span>
                  <div class="icon-shine"></div>
                </div>

                <div class="app-info">
                  <h3>{{ lang.isAr() ? p.ar.title : p.en.title }}</h3>
                  <div class="category">{{ lang.isAr() ? p.meta.ar.role : p.meta.en.role }}</div>
                  <div class="rating">
                    <span class="stars">★★★★★</span>
                    <span class="rating-count">· {{ p.rating }} ({{ p.reviews }})</span>
                  </div>
                </div>

                <button class="get-btn" type="button" (click)="open(p)">
                  {{ lang.t('عرض', 'Get') }}
                </button>
              </div>

              <p class="desc">{{ lang.isAr() ? p.ar.desc : p.en.desc }}</p>

              <div class="meta-bar">
                <div class="meta-cell">
                  <small>{{ lang.t('التقييم', 'Rating') }}</small>
                  <strong>{{ p.rating }}<span class="m-star">★</span></strong>
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
        title: 'تطبيق ذكرني',
        desc: 'تطبيق أذكار ومواقيت صلاة بإشعارات ذكية وتجربة استخدام بسيطة.',
        long: 'تطبيق إسلامي شامل يجمع الأذكار اليومية، تنبيهات مواقيت الصلاة حسب موقعك، القرآن الكريم، والتقويم الهجري. صُمم بحيث يكون الاستخدام بضغطة واحدة، مع وضع ليلي يريح العين ودعم كامل للويدجت على الشاشة الرئيسية.'
      },
      en: {
        title: 'Reminder App',
        desc: 'An athkar and prayer-times app with smart notifications and a simple UX.',
        long: 'A complete Islamic app combining daily athkar, location-based prayer alerts, Quran, and the Hijri calendar. Designed for one-tap usage, with a comfortable dark mode and full home-screen widget support.'
      },
      tags: ['Swift', 'SwiftUI', 'WidgetKit', 'Core Location', 'Notifications'],
      gradient: 'linear-gradient(135deg, #2ee6a8 0%, #00d4ff 100%)',
      emoji: '🕌',
      link: '#',
      meta: {
        ar: { role: 'مطور iOS', year: '2025' },
        en: { role: 'iOS Developer', year: '2025' }
      },
      features: [
        { ar: 'إشعارات أذان حسب الموقع', en: 'Location-aware Adhan notifications' },
        { ar: 'ويدجت على شاشة القفل والشاشة الرئيسية', en: 'Lock-screen and home-screen widgets' },
        { ar: 'وضع ليلي مريح للعين', en: 'Eye-friendly dark mode' },
        { ar: 'مزامنة عبر iCloud', en: 'iCloud sync' }
      ],
      rating: 4.9,
      reviews: '12K',
      age: '4+',
      size: '38MB',
      category: { ar: 'نمط الحياة', en: 'Lifestyle' },
      platform: 'mobile'
    },
    {
      ar: {
        title: 'متجر فاست',
        desc: 'متجر إلكتروني native لـ iOS و Android مع دفع آمن وتتبع الطلبات.',
        long: 'تطبيق متجر متكامل يدعم آلاف المنتجات، فلاتر بحث متقدمة، عربة شراء سلسة، ودفع مؤمَّن عبر Apple Pay و Google Pay. يدعم تتبع الطلبات لحظياً ويعرض إشعارات للعروض المخصصة لكل مستخدم.'
      },
      en: {
        title: 'Fast Store',
        desc: 'A native iOS and Android e-commerce app with secure checkout and order tracking.',
        long: 'A full shopping app handling thousands of products, advanced filters, a smooth cart, and secure checkout via Apple Pay and Google Pay. Supports real-time order tracking and personalized push notifications for offers.'
      },
      tags: ['Flutter', 'Dart', 'Stripe', 'Firebase', 'GraphQL'],
      gradient: 'linear-gradient(135deg, #ff4ecd 0%, #7b5cff 100%)',
      emoji: '🛍️',
      link: '#',
      meta: {
        ar: { role: 'مطور Flutter', year: '2024' },
        en: { role: 'Flutter Developer', year: '2024' }
      },
      features: [
        { ar: 'دفع عبر Apple Pay و Google Pay', en: 'Apple Pay & Google Pay checkout' },
        { ar: 'تتبع الطلبات لحظياً', en: 'Real-time order tracking' },
        { ar: 'إشعارات عروض مخصصة', en: 'Personalized offer notifications' },
        { ar: 'بحث صوتي عن المنتجات', en: 'Voice product search' }
      ],
      rating: 4.7,
      reviews: '45K',
      age: '4+',
      size: '52MB',
      category: { ar: 'تسوق', en: 'Shopping' },
      platform: 'mobile'
    },
    {
      ar: {
        title: 'لياقتي',
        desc: 'تطبيق لياقة بدنية مع خطط تمارين وتتبع للنشاط اليومي.',
        long: 'تطبيق لياقة شامل يضم خطط تمارين أسبوعية مخصصة، تتبع للخطوات والسعرات، تكامل مع Apple Health و Google Fit، وفيديوهات تمارين عالية الجودة. يحتوي ساعة Watch app لتتبع التمرين على iOS.'
      },
      en: {
        title: 'My Fitness',
        desc: 'A fitness app with workout plans and daily activity tracking.',
        long: 'A complete fitness app featuring custom weekly workout plans, step and calorie tracking, integration with Apple Health and Google Fit, and HD workout videos. Includes a companion Apple Watch app for live workout tracking.'
      },
      tags: ['Kotlin', 'Jetpack Compose', 'Health Connect', 'Room', 'Hilt'],
      gradient: 'linear-gradient(135deg, #ffb547 0%, #ff4ecd 100%)',
      emoji: '💪',
      link: '#',
      meta: {
        ar: { role: 'مطور Android', year: '2024' },
        en: { role: 'Android Developer', year: '2024' }
      },
      features: [
        { ar: 'خطط تمارين مخصصة', en: 'Personalized workout plans' },
        { ar: 'تكامل Apple Health و Google Fit', en: 'Apple Health & Google Fit integration' },
        { ar: 'Watch app على iOS', en: 'Apple Watch companion app' },
        { ar: 'تحدي يومي مع الأصدقاء', en: 'Daily challenges with friends' }
      ],
      rating: 4.8,
      reviews: '28K',
      age: '12+',
      size: '64MB',
      category: { ar: 'صحة ولياقة', en: 'Health & Fitness' },
      platform: 'mobile'
    },
    {
      ar: {
        title: 'Snap Chat Pro',
        desc: 'تطبيق محادثة بمكالمات صوت وفيديو ورسائل مشفرة.',
        long: 'تطبيق محادثة آمن ومشفر طرف لطرف، يدعم المحادثات الجماعية، المكالمات الصوتية والمرئية بجودة HD، الرسائل الصوتية، ومشاركة الملفات. يحتوي على ستوريات وفلاتر AR متقدمة.'
      },
      en: {
        title: 'Snap Chat Pro',
        desc: 'A messaging app with voice/video calls and end-to-end encrypted chats.',
        long: 'A secure end-to-end encrypted messaging app supporting group chats, HD voice and video calls, voice notes, and file sharing. Includes stories and advanced AR filters.'
      },
      tags: ['React Native', 'WebRTC', 'Signal Protocol', 'Firebase'],
      gradient: 'linear-gradient(135deg, #7b5cff 0%, #00d4ff 100%)',
      emoji: '💬',
      link: '#',
      meta: {
        ar: { role: 'مطور React Native', year: '2023' },
        en: { role: 'React Native', year: '2023' }
      },
      features: [
        { ar: 'تشفير من طرف إلى طرف', en: 'End-to-end encryption' },
        { ar: 'مكالمات HD صوت وفيديو', en: 'HD voice & video calls' },
        { ar: 'فلاتر AR للوجه', en: 'AR face filters' },
        { ar: 'ستوريات تختفي بعد 24 ساعة', en: 'Stories that vanish in 24h' }
      ],
      rating: 4.6,
      reviews: '120K',
      age: '12+',
      size: '78MB',
      category: { ar: 'تواصل', en: 'Social' },
      platform: 'mobile'
    },
    {
      ar: {
        title: 'لوحة Analytics',
        desc: 'منصة ويب لتحليل بيانات التطبيقات، dashboards فورية، تقارير قابلة للتخصيص.',
        long: 'منصة SaaS ببنية Multi-tenant، واجهة Angular، Backend بـ NestJS، قاعدة بيانات Postgres مع TimescaleDB للسلاسل الزمنية، رسوم بيانية فورية عبر WebSockets، تصدير PDF و CSV، صلاحيات على مستوى الصف، و SSO عبر OAuth2.'
      },
      en: {
        title: 'Analytics Dashboard',
        desc: 'A web platform for analyzing app data — live dashboards, customizable reports.',
        long: 'A multi-tenant SaaS platform — Angular front-end, NestJS back-end, Postgres + TimescaleDB for time-series, live charts over WebSockets, PDF/CSV export, row-level permissions, and OAuth2 SSO.'
      },
      tags: ['Angular', 'NestJS', 'PostgreSQL', 'TimescaleDB', 'WebSockets', 'Tailwind'],
      gradient: 'linear-gradient(135deg, #00d4ff 0%, #7b5cff 100%)',
      emoji: '📊',
      link: '#',
      meta: {
        ar: { role: 'Web Developer', year: '2025' },
        en: { role: 'Web Developer', year: '2025' }
      },
      features: [
        { ar: 'Dashboards فورية بـ WebSockets', en: 'Real-time dashboards over WebSockets' },
        { ar: 'تصدير PDF و CSV',                en: 'PDF and CSV export' },
        { ar: 'صلاحيات على مستوى الصف',         en: 'Row-level access control' },
        { ar: 'SSO عبر OAuth2 / OIDC',          en: 'SSO via OAuth2 / OIDC' }
      ],
      rating: 4.9,
      reviews: '320',
      age: '4+',
      size: '—',
      category: { ar: 'تحليلات', en: 'Analytics' },
      platform: 'web'
    },
    {
      ar: {
        title: 'منصة CMS',
        desc: 'موقع إخباري بـ Next.js و Headless CMS، أداء عالي و SEO محسّن.',
        long: 'موقع محتوى عالي الأداء بـ Next.js (App Router)، ISR للمقالات، صور AVIF/WebP، Sitemap و RSS، تكامل مع Headless CMS (Strapi)، CDN عبر Cloudflare، و Lighthouse 100/100 للأداء و SEO.'
      },
      en: {
        title: 'News Platform',
        desc: 'A Next.js + Headless CMS news site — fast, SEO-tuned, beautifully fast.',
        long: 'High-performance content site on Next.js (App Router), ISR for articles, AVIF/WebP images, Sitemap and RSS, Strapi headless CMS integration, Cloudflare CDN, scoring 100/100 on Lighthouse for performance and SEO.'
      },
      tags: ['Next.js', 'TypeScript', 'Strapi', 'Cloudflare', 'Tailwind'],
      gradient: 'linear-gradient(135deg, #ff4ecd 0%, #ffb547 100%)',
      emoji: '📰',
      link: '#',
      meta: {
        ar: { role: 'Web Engineer', year: '2024' },
        en: { role: 'Web Engineer', year: '2024' }
      },
      features: [
        { ar: 'Lighthouse 100/100',          en: 'Lighthouse 100/100' },
        { ar: 'ISR + Edge caching',          en: 'ISR + edge caching' },
        { ar: 'دعم RTL/LTR كامل',            en: 'Full RTL/LTR support' },
        { ar: 'تحليلات بدون تتبع',           en: 'Privacy-first analytics' }
      ],
      rating: 4.8,
      reviews: '180',
      age: '4+',
      size: '—',
      category: { ar: 'محتوى', en: 'Content' },
      platform: 'web'
    },
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
