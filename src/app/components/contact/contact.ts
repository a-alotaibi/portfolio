import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { RevealDirective } from '../../directives/reveal.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';

interface Channel {
  ar: { label: string; sub: string };
  en: { label: string; sub: string };
  href: string;
  gradient: string;
  copy?: string;
  iconPath: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealDirective, MagneticDirective, FormsModule],
  template: `
    <section id="contact" class="section">
      <div class="container">
        <h2 class="section-title" reveal="up">{{ lang.t('تواصل', 'Contact') }}</h2>
        <p class="section-sub" reveal="up" [delay]="100">
          {{ lang.t('أي طريقة تناسبك للتواصل', 'Any way that works for you') }}
        </p>

        <div class="contact-grid">
          <div class="cta-card" reveal="scale" [delay]="150">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="cta-text">
              <h3>{{ lang.t('تواصل معي', 'Get in touch') }}</h3>
              <p>{{ lang.t(
                'اكتب رسالتك وأرد عليك خلال 24 ساعة.',
                "Drop a message — I'll reply within 24h."
              ) }}</p>
            </div>

            @if (sent()) {
              <div class="success" role="status" aria-live="polite">
                <div class="success-icon">✓</div>
                <h4>{{ lang.t('تم تجهيز رسالتك', 'Your message is ready') }}</h4>
                <p>{{ lang.t('فُتح بريدك الافتراضي — راجع المرسل وأرسل.', 'Your default mail app opened — review and send.') }}</p>
                <button class="reset-btn" (click)="reset()">
                  {{ lang.t('إرسال أخرى', 'Send another') }}
                </button>
              </div>
            } @else {
              <form class="form" (submit)="submit($event)" novalidate>
                <div class="row">
                  <label class="field" [class.invalid]="touched() && !validName()">
                    <span>{{ lang.t('الاسم', 'Name') }}</span>
                    <input type="text"
                           [ngModel]="name()"
                           (ngModelChange)="name.set($event)"
                           name="name"
                           autocomplete="name"
                           [placeholder]="lang.t('اسمك الكريم', 'Your name')"
                           required>
                  </label>
                  <label class="field" [class.invalid]="touched() && !validEmail()">
                    <span>{{ lang.t('البريد', 'Email') }}</span>
                    <input type="email"
                           [ngModel]="email()"
                           (ngModelChange)="email.set($event)"
                           name="email"
                           autocomplete="email"
                           placeholder="you@example.com"
                           required>
                  </label>
                </div>

                <label class="field" [class.invalid]="touched() && !validMessage()">
                  <span class="m-row">
                    <span>{{ lang.t('الرسالة', 'Message') }}</span>
                    <span class="counter" [class.warn]="message().length > 480">{{ message().length }}/500</span>
                  </span>
                  <textarea [ngModel]="message()"
                            (ngModelChange)="message.set($event)"
                            name="message"
                            rows="4"
                            maxlength="500"
                            [placeholder]="lang.t('اكتب رسالتك…', 'Write your message…')"
                            required></textarea>
                </label>

                <button type="submit" class="cta-btn" [disabled]="!isValid()" [magnetic]="0.18">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                  {{ lang.t('أرسل الرسالة', 'Send message') }}
                </button>
              </form>
            }
          </div>
        </div>

        <div class="grid">
          @for (c of channels; track c.en.label; let i = $index) {
            <a [href]="c.href"
               target="_blank"
               rel="noopener"
               class="channel"
               reveal="up"
               [delay]="i * 80">
              <div class="ch-icon" [style.background]="c.gradient">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path [attr.d]="c.iconPath"/>
                </svg>
              </div>
              <div class="ch-info">
                <strong>{{ lang.isAr() ? c.ar.label : c.en.label }}</strong>
                <span>{{ lang.isAr() ? c.ar.sub : c.en.sub }}</span>
              </div>
              <div class="ch-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </div>
            </a>
          }
        </div>

        <div class="info" reveal="up" [delay]="500">
          <div class="info-item">
            <span class="info-icon">📍</span>
            <div>
              <small>{{ lang.t('الموقع', 'Location') }}</small>
              <strong>{{ lang.t('الرياض، السعودية', 'Riyadh, Saudi Arabia') }}</strong>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">🕐</span>
            <div>
              <small>{{ lang.t('وقت الرد', 'Response time') }}</small>
              <strong>{{ lang.t('خلال 24 ساعة', 'Within 24h') }}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-grid {
      display: grid;
      gap: 32px;
      margin-bottom: 32px;
    }

    .cta-card {
      position: relative;
      padding: 36px 40px;
      background: var(--grad-1);
      background-size: 200% 200%;
      border-radius: var(--radius-lg);
      overflow: hidden;
      animation: gradient-shift 8s ease-in-out infinite;
    }
    .cta-card .cta-text { margin-bottom: 24px; position: relative; z-index: 2; }
    .cta-card form,
    .cta-card .success {
      position: relative;
      z-index: 2;
    }
    .ring {
      position: absolute;
      border: 2px dashed rgba(255,255,255,0.25);
      border-radius: 50%;
      pointer-events: none;
    }
    .ring-1 {
      width: 220px; height: 220px;
      top: -80px; inset-inline-end: -50px;
      animation: ring-spin 30s linear infinite;
    }
    .ring-2 {
      width: 140px; height: 140px;
      bottom: -50px; inset-inline-start: -30px;
      animation: ring-spin 24s linear reverse infinite;
    }

    .cta-text { flex: 1; min-width: 240px; position: relative; }
    .cta-text h3 {
      margin: 0 0 6px;
      color: #fff;
      font-size: clamp(1.4rem, 3vw, 1.8rem);
      font-weight: 800;
    }
    .cta-text p {
      margin: 0;
      color: rgba(255,255,255,0.85);
      font-size: 1rem;
    }
    .cta-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      background: #fff;
      color: #14142b;
      border-radius: 999px;
      font-weight: 800;
      font-size: 1rem;
      border: 0;
      cursor: pointer;
      transition: transform 0.3s var(--ease-bounce), box-shadow 0.3s, opacity 0.3s;
      position: relative;
    }
    .cta-btn:hover { box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4); }
    .cta-btn:disabled { opacity: 0.55; cursor: not-allowed; }

    /* ---- Form ---- */
    .form {
      display: grid;
      gap: 16px;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: #fff;
    }
    .field > span {
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      opacity: 0.92;
    }
    .field input,
    .field textarea {
      width: 100%;
      padding: 12px 14px;
      background: rgba(0,0,0,0.25);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      color: #fff;
      font-family: inherit;
      font-size: 0.95rem;
      transition: border-color 0.25s, background 0.25s, transform 0.25s;
    }
    .field textarea { resize: vertical; min-height: 96px; }
    .field input::placeholder,
    .field textarea::placeholder { color: rgba(255,255,255,0.6); }
    .field input:focus,
    .field textarea:focus {
      border-color: #fff;
      background: rgba(0,0,0,0.35);
      outline: none;
    }
    .field.invalid input,
    .field.invalid textarea {
      border-color: #ffb547;
      background: rgba(255,180,71,0.12);
    }
    .m-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .counter {
      font-size: 0.72rem;
      font-weight: 700;
      opacity: 0.7;
    }
    .counter.warn { color: #ffb547; opacity: 1; }

    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .chip-pick {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: rgba(0,0,0,0.25);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 999px;
      color: #fff;
      font-weight: 700;
      font-size: 0.82rem;
      cursor: pointer;
      transition: 0.25s var(--ease-out);
    }
    .chip-pick:hover { background: rgba(0,0,0,0.4); transform: translateY(-2px); }
    .chip-pick.active {
      background: #fff;
      color: #14142b;
      border-color: transparent;
    }

    .success {
      text-align: center;
      padding: 16px 0;
      color: #fff;
    }
    .success-icon {
      width: 64px; height: 64px;
      display: grid;
      place-items: center;
      margin: 0 auto 14px;
      background: #fff;
      color: #2ee6a8;
      font-size: 2.2rem;
      font-weight: 900;
      border-radius: 50%;
      box-shadow: 0 16px 36px -8px rgba(0,0,0,0.3);
      animation: pop-in 0.5s var(--ease-bounce);
    }
    @keyframes pop-in {
      0% { transform: scale(0); }
      100% { transform: scale(1); }
    }
    .success h4 { margin: 0 0 6px; font-size: 1.2rem; font-weight: 800; }
    .success p { margin: 0 0 18px; opacity: 0.9; }
    .reset-btn {
      padding: 10px 22px;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
      border-radius: 999px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.25s;
    }
    .reset-btn:hover { background: rgba(0,0,0,0.5); transform: translateY(-2px); }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 14px;
      margin-bottom: 32px;
    }

    .channel {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      transition: transform 0.3s var(--ease-out), border-color 0.3s, box-shadow 0.3s;
    }
    .channel:hover {
      transform: translateY(-4px);
      border-color: var(--c2);
      box-shadow: 0 24px 48px -20px rgba(123,92,255,0.4);
    }

    .ch-icon {
      width: 48px; height: 48px;
      flex-shrink: 0;
      border-radius: 22%;
      display: grid;
      place-items: center;
      color: #fff;
      box-shadow: 0 12px 24px -10px rgba(0,0,0,0.4);
      transition: transform 0.4s var(--ease-bounce);
    }
    .channel:hover .ch-icon { transform: rotate(-8deg) scale(1.1); }

    .ch-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .ch-info strong { font-weight: 800; font-size: 0.98rem; }
    .ch-info span { font-size: 0.82rem; color: var(--text-mute); }

    .ch-arrow {
      color: var(--text-mute);
      transition: 0.25s;
    }
    html[dir='rtl'] .ch-arrow svg { transform: scaleX(-1); }
    .channel:hover .ch-arrow { color: var(--c2); transform: translateX(4px); }
    html[dir='rtl'] .channel:hover .ch-arrow { transform: translateX(-4px); }

    .info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      padding: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .info-icon {
      font-size: 1.7rem;
    }
    .info-item small {
      display: block;
      font-size: 0.75rem;
      color: var(--text-mute);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .info-item strong {
      font-size: 0.95rem;
      color: var(--text);
      font-weight: 700;
    }
    .avail {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--c5) !important;
    }
    .avail .dot {
      width: 7px; height: 7px;
      background: var(--c5);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--c5);
      animation: pulse-glow 1.5s ease-in-out infinite;
    }

    @media (max-width: 600px) {
      .cta-card { padding: 24px; }
      .cta-btn { justify-content: center; width: 100%; }
      .row { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent {
  protected lang = inject(LanguageService);

  protected name = signal('');
  protected email = signal('');
  protected message = signal('');
  protected touched = signal(false);
  protected sent = signal(false);

  protected validName = computed(() => this.name().trim().length >= 2);
  protected validEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim()));
  protected validMessage = computed(() => this.message().trim().length >= 10);
  protected isValid = computed(() => this.validName() && this.validEmail() && this.validMessage());

  submit(e: Event) {
    e.preventDefault();
    this.touched.set(true);
    if (!this.isValid()) return;

    const subjectLine = encodeURIComponent(this.name());
    const body = encodeURIComponent(
      `${this.message()}\n\n— ${this.name()}\n${this.email()}`
    );
    const mailto = `mailto:abdulaziz@example.com?subject=${subjectLine}&body=${body}`;
    if (typeof window !== 'undefined') {
      window.location.href = mailto;
    }
    this.sent.set(true);
  }

  reset() {
    this.name.set('');
    this.email.set('');
    this.message.set('');
    this.touched.set(false);
    this.sent.set(false);
  }

  protected channels: Channel[] = [
    {
      ar: { label: 'البريد الإلكتروني', sub: 'abdulaziz@example.com' },
      en: { label: 'Email', sub: 'abdulaziz@example.com' },
      href: 'mailto:abdulaziz@example.com',
      gradient: 'linear-gradient(135deg, #ff4ecd, #7b5cff)',
      iconPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.5l8 5 8-5V6H4zm0 2.5V18h16V8.5l-8 5-8-5z'
    },
    {
      ar: { label: 'واتساب', sub: '+966 5X XXX XXXX' },
      en: { label: 'WhatsApp', sub: '+966 5X XXX XXXX' },
      href: 'https://wa.me/9665XXXXXXXX',
      gradient: 'linear-gradient(135deg, #2ee6a8, #00d4ff)',
      iconPath: 'M17.6 6.32A7.86 7.86 0 0 0 12 4a8 8 0 0 0-7 11.84L4 20l4.28-1.12A7.94 7.94 0 0 0 12 20a8 8 0 0 0 5.6-13.68zM12 18.5a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25A6.5 6.5 0 1 1 12 18.5zm3.6-4.86c-.2-.1-1.18-.58-1.36-.65s-.32-.1-.46.1-.52.65-.64.78-.24.15-.44.05a5.4 5.4 0 0 1-2.7-2.36c-.2-.35.2-.32.58-1.07.06-.13.03-.24-.02-.34s-.46-1.1-.62-1.5-.32-.34-.46-.34h-.4a.78.78 0 0 0-.55.26 2.36 2.36 0 0 0-.74 1.76 4.1 4.1 0 0 0 .85 2.16 9.4 9.4 0 0 0 3.62 3.18c.5.22.9.35 1.21.45a2.96 2.96 0 0 0 1.34.08 2.2 2.2 0 0 0 1.44-1.02 1.78 1.78 0 0 0 .12-1c-.05-.1-.18-.16-.38-.25z'
    },
    {
      ar: { label: 'لينكد إن', sub: '/in/abdulaziz' },
      en: { label: 'LinkedIn', sub: '/in/abdulaziz' },
      href: 'https://linkedin.com/in/abdulaziz',
      gradient: 'linear-gradient(135deg, #00d4ff, #7b5cff)',
      iconPath: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.74H5.67v8.6h2.67zM7 8.55a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.79v-4.71c0-2.5-1.34-3.66-3.12-3.66a2.7 2.7 0 0 0-2.45 1.34V9.74h-2.67v8.6h2.67v-4.74c0-1.04.45-1.66 1.4-1.66.85 0 1.5.6 1.5 1.7v4.7h2.67z'
    }
  ];
}
