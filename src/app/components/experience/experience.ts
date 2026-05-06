import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { RevealDirective } from '../../directives/reveal.directive';

interface Job {
  ar: { role: string; company: string; desc: string };
  en: { role: string; company: string; desc: string };
  period: string;
  emoji: string;
  logo?: string;
  gradient: string;
  tags: string[];
  current?: boolean;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section id="experience" class="section">
      <div class="container">
        <h2 class="section-title" reveal="up">{{ lang.t('الخبرات', 'Experience') }}</h2>
        <p class="section-sub" reveal="up" [delay]="100">
          {{ lang.t('محطاتي في الهندسة — تطبيقات وويب وأنظمة', 'My engineering journey — apps, web, and systems') }}
        </p>

        <div class="timeline">
          <div class="line"></div>

          @for (job of jobs; track job.en.company; let i = $index) {
            <div class="row" reveal="up" [delay]="i * 120">
              <div class="dot" [style.background]="job.gradient"></div>

              <div class="card">
                <div class="card-head">
                  @if (job.logo) {
                    <div class="icon icon-logo">
                      <img [src]="job.logo" [alt]="lang.isAr() ? job.ar.company : job.en.company">
                    </div>
                  } @else {
                    <div class="icon" [style.background]="job.gradient">
                      <span>{{ job.emoji }}</span>
                    </div>
                  }
                  <div class="head-info">
                    <h3>{{ lang.isAr() ? job.ar.role : job.en.role }}</h3>
                    <div class="company">
                      <span>{{ lang.isAr() ? job.ar.company : job.en.company }}</span>
                      @if (job.current) {
                        <span class="badge-now">
                          <span class="ndot"></span>
                          {{ lang.t('حالياً', 'Now') }}
                        </span>
                      }
                    </div>
                    <div class="period">{{ job.period }}</div>
                  </div>
                </div>

                <p class="desc">{{ lang.isAr() ? job.ar.desc : job.en.desc }}</p>

                <div class="tags">
                  @for (t of job.tags; track t) {
                    <span class="t">{{ t }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .timeline {
      position: relative;
      padding-inline-start: 40px;
    }
    .line {
      position: absolute;
      inset-block: 12px;
      inset-inline-start: 18px;
      width: 2px;
      background: linear-gradient(180deg, var(--c1) 0%, var(--c2) 50%, var(--c3) 100%);
      border-radius: 2px;
      opacity: 0.5;
    }
    .row {
      position: relative;
      margin-bottom: 28px;
    }
    .dot {
      position: absolute;
      inset-inline-start: -30px;
      top: 24px;
      width: 16px; height: 16px;
      border-radius: 50%;
      box-shadow: 0 0 0 4px var(--bg), 0 0 14px rgba(123, 92, 255, 0.6);
      z-index: 1;
    }
    .card {
      padding: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      transition: transform 0.35s var(--ease-out), border-color 0.3s, box-shadow 0.3s;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: var(--c2);
      box-shadow: 0 30px 60px -25px rgba(123,92,255,0.4);
    }

    .card-head {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 14px;
    }
    .icon {
      width: 56px; height: 56px;
      border-radius: 22%;
      display: grid;
      place-items: center;
      flex-shrink: 0;
      box-shadow: 0 14px 28px -10px rgba(0,0,0,0.3);
      transition: transform 0.4s var(--ease-bounce);
    }
    .card:hover .icon { transform: rotate(-8deg) scale(1.06); }
    .icon span { font-size: 1.7rem; }
    .icon-logo {
      background: #fff;
      padding: 8px;
    }
    .icon-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .head-info { flex: 1; min-width: 0; }
    h3 {
      margin: 0 0 4px;
      font-size: 1.1rem;
      font-weight: 800;
    }
    .company {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      color: var(--text-dim);
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 4px;
    }
    .badge-now {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 10px;
      background: rgba(46,230,168,0.15);
      border: 1px solid rgba(46,230,168,0.3);
      border-radius: 999px;
      color: var(--c5);
      font-size: 0.7rem;
      font-weight: 700;
    }
    .ndot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--c5);
      animation: pulse-glow 1.4s ease-in-out infinite;
    }
    .period {
      font-size: 0.82rem;
      color: var(--text-mute);
      font-weight: 600;
    }

    .desc {
      margin: 0 0 14px;
      color: var(--text-dim);
      line-height: 1.7;
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
      transition: 0.25s;
    }
    .t:hover {
      transform: translateY(-2px);
      color: var(--text);
      border-color: var(--c2);
    }

    @media (max-width: 600px) {
      .timeline { padding-inline-start: 28px; }
      .line { inset-inline-start: 10px; }
      .dot { inset-inline-start: -22px; width: 12px; height: 12px; }
    }
  `]
})
export class ExperienceComponent {
  protected lang = inject(LanguageService);

  protected jobs: Job[] = [
    {
      period: '2023 — ' + (typeof window !== 'undefined' ? '' : ''),
      ar: {
        role: 'مطور ويب وموبايل',
        company: 'شركة البيئة مخططون ومعماريون ومهندسون',
        desc: 'أطوّر تطبيقات iOS و Android ومنصات ويب حديثة بـ Next.js. أركّز على تجربة المستخدم، الأداء، وبناء حلول رقمية تخدم مشاريع التخطيط والعمارة والهندسة.'
      },
      en: {
        role: 'Web & Mobile Developer',
        company: 'BEEAH Planners, Architects & Engineers',
        desc: 'Building iOS/Android apps and modern web platforms with Next.js. Focused on UX, performance, and delivering digital solutions for planning, architecture, and engineering projects.'
      },
      emoji: '🚀',
      logo: 'companies/beeah.png',
      gradient: 'linear-gradient(135deg, #ff4ecd 0%, #7b5cff 100%)',
      tags: ['Swift', 'Kotlin', 'Next.js', 'TypeScript'],
      current: true
    }
  ];
}
