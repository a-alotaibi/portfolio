import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { RevealDirective } from '../../directives/reveal.directive';

interface SkillGroup {
  ar: string;
  en: string;
  color: string;
  icon: string;
  items: string[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section id="skills" class="section">
      <div class="container">
        <h2 class="section-title" reveal="up">{{ lang.t('المهارات', 'Skills') }}</h2>
        <p class="section-sub" reveal="up" [delay]="100">
          {{ lang.t('الأدوات اللي أشتغل فيها يومياً', 'The tools I work with day-to-day') }}
        </p>

        <div class="grid">
          @for (group of groups; track group.en; let i = $index) {
            <div class="skill-card"
                 [style.--card-color]="group.color"
                 reveal="up"
                 [delay]="i * 100">
              <div class="card-head">
                <div class="card-icon">{{ group.icon }}</div>
                <h3>{{ lang.isAr() ? group.ar : group.en }}</h3>
              </div>
              <div class="chips">
                @for (item of group.items; track item) {
                  <span class="chip">{{ item }}</span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .skill-card {
      --card-color: var(--c2);
      position: relative;
      padding: 28px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: transform 0.4s var(--ease-out), border-color 0.3s, box-shadow 0.3s;
    }
    .skill-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right, var(--card-color) 0%, transparent 60%);
      opacity: 0.12;
      pointer-events: none;
      transition: opacity 0.4s;
    }
    .skill-card::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(135deg, var(--card-color), transparent 50%);
      -webkit-mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.4s;
      pointer-events: none;
    }
    .skill-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 30px 60px -25px var(--card-color);
    }
    .skill-card:hover::before { opacity: 0.25; }
    .skill-card:hover::after  { opacity: 1; }

    .card-head {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 20px;
      position: relative;
    }
    .card-icon {
      width: 52px; height: 52px;
      display: grid; place-items: center;
      background: var(--card-color);
      border-radius: 28%;
      font-size: 1.7rem;
      box-shadow: 0 12px 24px -10px var(--card-color);
      transition: transform 0.4s var(--ease-bounce);
    }
    .skill-card:hover .card-icon { transform: rotate(-10deg) scale(1.1); }
    .card-head h3 { margin: 0; font-size: 1.15rem; font-weight: 800; }

    .chips { display: flex; flex-wrap: wrap; gap: 8px; position: relative; }
    .chip {
      padding: 7px 14px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-dim);
      transition: transform 0.25s var(--ease-bounce), background 0.25s, color 0.25s, border-color 0.25s;
    }
    .chip:hover {
      background: var(--card-color);
      color: #fff;
      border-color: transparent;
      transform: translateY(-3px) scale(1.05);
    }
  `]
})
export class SkillsComponent {
  protected lang = inject(LanguageService);

  protected groups: SkillGroup[] = [
    {
      ar: 'تطبيقات الجوال',
      en: 'Mobile apps',
      icon: '📱',
      color: '#ff4ecd',
      items: ['Swift', 'SwiftUI', 'Kotlin', 'Jetpack Compose', 'Flutter', 'React Native']
    },
    {
      ar: 'واجهات الويب',
      en: 'Web frontend',
      icon: '🌐',
      color: '#7b5cff',
      items: ['Angular', 'Next.js', 'React', 'TypeScript', 'Tailwind', 'SCSS', 'Vite']
    },
    {
      ar: 'تصميم وتجربة المستخدم',
      en: 'Design & UX',
      icon: '🎨',
      color: '#00d4ff',
      items: ['Figma', 'UI/UX', 'Responsive design', 'HIG', 'Material Design', 'Prototyping']
    },
    {
      ar: 'الأدوات والممارسات',
      en: 'Tools & workflow',
      icon: '🛠️',
      color: '#2ee6a8',
      items: ['Git', 'GitHub', 'VS Code', 'Xcode', 'Android Studio', 'Postman']
    }
  ];
}
