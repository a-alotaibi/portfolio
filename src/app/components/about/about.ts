import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { RevealDirective } from '../../directives/reveal.directive';

interface Highlight {
  icon: string;
  ar: { title: string; desc: string };
  en: { title: string; desc: string };
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section id="about" class="section">
      <div class="container">
        <h2 class="section-title" reveal="up">{{ lang.t('عني', 'About me') }}</h2>
        <p class="section-sub" reveal="up" [delay]="100">
          {{ lang.t('تطبيقات جوال ومواقع ويب — تحت سقف واحد', 'Mobile apps and web platforms — under one roof') }}
        </p>

        <div class="grid">
          <div class="bio-card" reveal="left" [delay]="200">
            <div class="status-strip">
              <span class="signal-dot"></span>
              <span>{{ lang.t('متصل', 'Online') }} · iOS · Android · Web</span>
            </div>

            <p class="bio">
              {{ lang.t(
                'مطور مواقع وتطبيقات جوال: أبرمج تطبيقات iOS و Android، وأبني مواقع ومنصات ويب بـ Angular و Next.js. هدفي تجربة مستخدم سلسة وأداء عالي على كل شاشة.',
                "I'm a web and mobile developer: I ship iOS and Android apps, and build web platforms with Angular and Next.js. My goal: smooth user experiences and great performance on every screen."
              ) }}
            </p>
            <p class="bio">
              {{ lang.t(
                'أهتم بكل تفصيلة من التصميم إلى التسليم — تصاميم متجاوبة، تفاصيل التفاعل، الأداء، وتجربة مستخدم تخلّي المنتج يحس مدروس وممتع.',
                'I care about every detail from design to delivery — responsive layouts, interaction polish, performance, and a UX that feels considered and delightful.'
              ) }}
            </p>

            <div class="tag-row">
              @for (tag of tags; track tag; let i = $index) {
                <span class="tag" reveal="scale" [delay]="300 + i * 60">{{ tag }}</span>
              }
            </div>
          </div>

          <div class="highlights">
            @for (h of highlights; track h.icon; let i = $index) {
              <div class="highlight" reveal="right" [delay]="200 + i * 120">
                <div class="hl-icon">{{ h.icon }}</div>
                <div>
                  <h3>{{ lang.isAr() ? h.ar.title : h.en.title }}</h3>
                  <p>{{ lang.isAr() ? h.ar.desc : h.en.desc }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 32px;
      align-items: start;
    }

    .bio-card {
      background: linear-gradient(180deg, var(--surface-strong) 0%, var(--surface) 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 40px;
      position: relative;
      overflow: hidden;
      transition: transform 0.4s var(--ease-out), border-color 0.3s;
    }
    .bio-card:hover { transform: translateY(-4px); border-color: rgba(123, 92, 255, 0.4); }
    .bio-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--grad-1);
      opacity: 0.05;
      pointer-events: none;
      transition: opacity 0.4s;
    }
    .bio-card:hover::before { opacity: 0.1; }

    .status-strip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(46, 230, 168, 0.12);
      border: 1px solid rgba(46, 230, 168, 0.3);
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--c5);
      margin-bottom: 18px;
      position: relative;
    }
    .signal-dot {
      width: 6px; height: 6px;
      background: var(--c5);
      border-radius: 50%;
      box-shadow: 0 0 6px var(--c5);
      animation: pulse-glow 1.5s ease-in-out infinite;
    }

    .bio {
      font-size: 1.1rem;
      line-height: 1.9;
      color: var(--text-dim);
      margin: 0 0 18px;
      position: relative;
    }
    .bio:last-of-type { margin-bottom: 28px; }

    .tag-row { display: flex; flex-wrap: wrap; gap: 8px; position: relative; }
    .tag {
      padding: 6px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text);
      transition: transform 0.25s var(--ease-bounce), background 0.3s, border-color 0.3s;
    }
    .tag:hover {
      background: var(--grad-1);
      border-color: transparent;
      transform: translateY(-3px) scale(1.05);
    }

    .highlights { display: flex; flex-direction: column; gap: 14px; }
    .highlight {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 22px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      transition: transform 0.35s var(--ease-out), border-color 0.3s, box-shadow 0.3s;
    }
    .highlight:hover {
      transform: translateY(-4px) translateX(4px);
      border-color: var(--c2);
      box-shadow: 0 20px 40px -20px var(--c2);
    }
    html[dir='rtl'] .highlight:hover { transform: translateY(-4px) translateX(-4px); }
    .hl-icon {
      width: 52px; height: 52px;
      flex-shrink: 0;
      display: grid; place-items: center;
      background: var(--grad-1);
      border-radius: 28%;
      font-size: 1.7rem;
      box-shadow: 0 12px 24px -10px var(--c1);
      transition: transform 0.4s var(--ease-bounce);
    }
    .highlight:hover .hl-icon { transform: rotate(-8deg) scale(1.1); }
    .highlight h3 { margin: 0 0 6px; font-size: 1.05rem; }
    .highlight p { margin: 0; color: var(--text-mute); font-size: 0.92rem; line-height: 1.6; }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .bio-card { padding: 28px; }
    }
  `]
})
export class AboutComponent {
  protected lang = inject(LanguageService);

  protected tags = [
    'Swift', 'Kotlin', 'Flutter',
    'Angular', 'Next.js', 'TypeScript',
    'HTML', 'CSS', 'Tailwind',
    'Figma', 'UX/UI'
  ];

  protected highlights: Highlight[] = [
    {
      icon: '📱',
      ar: { title: 'تطبيقات Native و Cross-Platform', desc: 'Swift / SwiftUI، Kotlin / Compose، Flutter — أبني تطبيقات يحس فيها المستخدم إنها جزء طبيعي من جواله.' },
      en: { title: 'Apps — native and cross-platform', desc: 'Swift / SwiftUI, Kotlin / Compose, Flutter — apps that feel like a natural part of the device.' }
    },
    {
      icon: '🌐',
      ar: { title: 'مواقع ومنصات ويب', desc: 'واجهات بـ Angular و Next.js مع TypeScript — مواقع جاهزة لـ SEO، سريعة، ومتجاوبة على كل شاشة.' },
      en: { title: 'Web platforms', desc: 'Angular and Next.js front-ends with TypeScript — SEO-ready, fast, and responsive on every screen.' }
    },
    {
      icon: '🎨',
      ar: { title: 'تصميم تجربة المستخدم', desc: 'أصمّم بـ Figma بناءً على Human Interface Guidelines و Material Design، وأنفّذ التصاميم بدقة عالية.' },
      en: { title: 'UI/UX design', desc: 'Designs in Figma rooted in Human Interface Guidelines and Material Design — implemented with precision.' }
    },
    {
      icon: '⚡',
      ar: { title: 'أداء عالي', desc: 'أركّز على سرعة التحميل، خفة التفاعل، وتقليل حجم النطاق — تطبيقات ومواقع تحس فيها فرق.' },
      en: { title: 'Performance focus', desc: 'Fast loads, snappy interactions, lean payloads — apps and sites that feel noticeably better.' }
    }
  ];
}
