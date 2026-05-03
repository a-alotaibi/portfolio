import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { RevealDirective } from '../../directives/reveal.directive';

interface SocialLink { label: string; href: string; iconPath: string; }

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <footer class="footer" reveal="fade">
      <div class="container">
        <div class="grid">
          <div class="brand-col">
            <a class="brand-row" href="#home">
              <img src="logo.png" alt="" width="40" height="40">
              <div class="brand-text">
                <strong>{{ lang.t('عبدالعزيز', 'Abdulaziz') }}</strong>
                <span>Web & Mobile Developer</span>
              </div>
            </a>
            <p class="brand-bio">
              {{ lang.t(
                'مطور مواقع وتطبيقات جوال — أبني تجارب رقمية حديثة لـ iOS و Android والويب.',
                'Web & mobile developer — building modern digital experiences for iOS, Android, and the web.'
              ) }}
            </p>
          </div>

          <div class="col">
            <h4>{{ lang.t('استكشاف', 'Navigate') }}</h4>
            <ul>
              <li><a href="#home">{{ lang.t('الرئيسية', 'Home') }}</a></li>
              <li><a href="#about">{{ lang.t('عني', 'About') }}</a></li>
              <li><a href="#skills">{{ lang.t('المهارات', 'Skills') }}</a></li>
              <li><a href="#projects">{{ lang.t('التطبيقات', 'Apps') }}</a></li>
            </ul>
          </div>

          <div class="col">
            <h4>{{ lang.t('تواصل', 'Contact') }}</h4>
            <ul class="contact-list">
              <li><a href="mailto:abdulaziz&#64;example.com">abdulaziz&#64;example.com</a></li>
              <li><a href="https://wa.me/9665XXXXXXXX" target="_blank" rel="noopener">{{ lang.t('واتساب', 'WhatsApp') }}</a></li>
              <li class="loc">📍 {{ lang.t('الرياض، السعودية', 'Riyadh, Saudi Arabia') }}</li>
            </ul>
            <div class="socials">
              @for (s of socials; track s.label) {
                <a [href]="s.href" target="_blank" rel="noopener" [attr.aria-label]="s.label" class="soc">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path [attr.d]="s.iconPath"/>
                  </svg>
                </a>
              }
            </div>
          </div>
        </div>

        <div class="bar">
          <div class="copy">© {{ year }} {{ lang.t('عبدالعزيز · جميع الحقوق محفوظة', 'Abdulaziz · All rights reserved') }}</div>
          <div class="meta">
            {{ lang.t('صُنع بـ ♥ من Angular', 'Made with ♥ on Angular') }}
            <span class="sep">·</span>
            <a href="#home">{{ lang.t('عودة لأعلى', 'Back to top') }} ↑</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 60px 0 24px;
      margin-top: 80px;
      background:
        radial-gradient(1200px 200px at 50% 0%, rgba(123, 92, 255, 0.10), transparent 60%),
        linear-gradient(180deg, transparent 0%, var(--bg-2) 100%);
      border-top: 1px solid var(--border);
      position: relative;
    }

    .grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
      gap: 36px;
      margin-bottom: 36px;
    }

    .brand-row {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }
    .brand-row img {
      width: 40px; height: 40px;
      filter: drop-shadow(0 8px 18px rgba(123, 92, 255, 0.4));
    }
    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    .brand-text strong { font-weight: 800; font-size: 1.05rem; }
    .brand-text span { font-size: 0.78rem; color: var(--text-mute); }

    .brand-bio {
      color: var(--text-dim);
      line-height: 1.7;
      font-size: 0.92rem;
      margin: 0 0 16px;
      max-width: 320px;
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(46, 230, 168, 0.12);
      border: 1px solid rgba(46, 230, 168, 0.3);
      color: var(--c5);
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
    }
    .ping {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--c5);
      box-shadow: 0 0 8px var(--c5);
      animation: pulse-glow 1.5s ease-in-out infinite;
    }

    .col h4 {
      margin: 0 0 14px;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-mute);
    }
    .col ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 10px;
    }
    .col li {
      font-size: 0.92rem;
      color: var(--text-dim);
    }
    .col a {
      color: var(--text-dim);
      transition: color 0.2s, transform 0.2s;
      display: inline-block;
    }
    .col a:hover {
      color: var(--c2);
      transform: translateX(3px);
    }
    html[dir='rtl'] .col a:hover { transform: translateX(-3px); }
    .col li.loc { font-size: 0.88rem; }

    .socials {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
    .soc {
      width: 36px; height: 36px;
      display: grid;
      place-items: center;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-dim);
      border-radius: 50%;
      transition: 0.25s var(--ease-bounce);
    }
    .soc:hover {
      background: var(--grad-1);
      color: #fff;
      border-color: transparent;
      transform: translateY(-3px) scale(1.08);
      box-shadow: 0 12px 24px -8px var(--c1);
    }

    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding-top: 22px;
      border-top: 1px solid var(--border);
      font-size: 0.85rem;
      color: var(--text-mute);
    }
    .meta { display: inline-flex; align-items: center; gap: 6px; }
    .sep { opacity: 0.5; }
    .meta a {
      color: var(--text-dim);
      transition: color 0.2s;
    }
    .meta a:hover { color: var(--c2); }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr 1fr; gap: 28px; }
    }
    @media (max-width: 560px) {
      .grid { grid-template-columns: 1fr; gap: 24px; }
      .bar { justify-content: center; text-align: center; }
    }
  `]
})
export class FooterComponent {
  protected lang = inject(LanguageService);
  protected year = new Date().getFullYear();

  protected socials: SocialLink[] = [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/abdulaziz',
      iconPath: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.74H5.67v8.6h2.67zM7 8.55a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.79v-4.71c0-2.5-1.34-3.66-3.12-3.66a2.7 2.7 0 0 0-2.45 1.34V9.74h-2.67v8.6h2.67v-4.74c0-1.04.45-1.66 1.4-1.66.85 0 1.5.6 1.5 1.7v4.7h2.67z' },
    { label: 'X',        href: 'https://x.com/abdulaziz',
      iconPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' }
  ];
}
