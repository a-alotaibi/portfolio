import { Component, ElementRef, HostListener, ViewChild, computed, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { RevealDirective } from '../../directives/reveal.directive';
import { CountUpDirective } from '../../directives/count-up.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { TypewriterDirective } from '../../directives/typewriter.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective, CountUpDirective, MagneticDirective, TypewriterDirective],
  template: `
    <section id="home" class="hero" #host>
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
      <div class="bg-blob blob-3"></div>

      <div class="container hero-grid">
        <div class="hero-text">
          <span class="badge" reveal="up" [delay]="0">
            <span class="dot"></span>
            {{ lang.t('تطبيقات · ويب · أنظمة', 'Apps · Web · Systems') }}
          </span>

          <h1 reveal="up" [delay]="100">
            {{ lang.t('أهلاً، أنا', "Hi, I'm") }}
            <span class="name">{{ lang.t('عبدالعزيز', 'Abdulaziz') }}</span>
          </h1>

          <h2 class="role" reveal="up" [delay]="200">
            <span class="role-accent">{{ lang.t('مطور', 'Web') }}</span>
            {{ lang.t('مواقع و', '&') }}
            <span class="role-accent">{{ lang.t('تطبيقات', 'Mobile') }}</span>
            {{ lang.t('جوال', 'Developer') }}
          </h2>

          <div class="typed-row" reveal="up" [delay]="250">
            <span class="prompt">{{ lang.t('أبني', 'I build') }}</span>
            <span class="typed">
              <span [typewriter]="specialties()"></span><span class="caret">|</span>
            </span>
          </div>

          <p class="tagline" reveal="up" [delay]="300">
            {{ lang.t(
              'أبرمج تطبيقات iOS و Android، وأبني مواقع ومنصات ويب حديثة — تجربة سلسة وأداء عالي على كل شاشة.',
              'I build iOS and Android apps, and modern web platforms — smooth experience and great performance on every screen.'
            ) }}
          </p>

          <div class="cta-row" reveal="up" [delay]="400">
            <a class="cv-btn" href="cv.pdf" download="Abdulaziz_Alotaibi_CV.pdf" [magnetic]="0.22">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              {{ lang.t('السيرة الذاتية', 'Resume') }}
            </a>
          </div>

          <div class="stats" reveal="up" [delay]="500">
            <div class="stat">
              <div class="stat-num"><span [countUp]="10" suffix="+"></span></div>
              <div class="stat-label">{{ lang.t('مشروع', 'Projects shipped') }}</div>
            </div>
            <div class="stat">
              <div class="stat-num"><span [countUp]="3" suffix="+"></span></div>
              <div class="stat-label">{{ lang.t('سنوات خبرة', 'Years experience') }}</div>
            </div>
          </div>
        </div>

        <div class="hero-visual" reveal="scale" [delay]="200" #visual>
          <div class="device-stack">
            <!-- laptop / web mockup -->
            <div class="laptop">
              <div class="laptop-screen">
                <div class="browser-chrome">
                  <span class="bdot r"></span>
                  <span class="bdot y"></span>
                  <span class="bdot g"></span>
                  <div class="url-bar">
                    <span class="lock">🔒</span>
                    <span class="url-text">abdulaziz.dev</span>
                  </div>
                </div>
                <div class="browser-body">
                  <div class="web-nav">
                    <div class="web-logo"></div>
                    <div class="web-links">
                      <span></span><span></span><span></span><span></span>
                    </div>
                  </div>
                  <div class="web-hero">
                    <div class="web-text">
                      <div class="line w-70"></div>
                      <div class="line w-50 dim"></div>
                      <div class="line w-40 dim mini"></div>
                      <div class="web-btn"></div>
                    </div>
                    <div class="web-img"></div>
                  </div>
                  <div class="web-cards">
                    <div class="web-card"></div>
                    <div class="web-card"></div>
                    <div class="web-card"></div>
                  </div>
                </div>
              </div>
              <div class="laptop-base"></div>
            </div>

            <!-- main phone -->
            <div class="phone phone-front">
              <div class="phone-frame">
                <div class="notch"></div>
                <div class="screen">
                  <div class="status-bar">
                    <span>9:41</span>
                    <div class="status-icons">
                      <span class="signal"></span>
                      <span class="wifi"></span>
                      <span class="battery"></span>
                    </div>
                  </div>

                  <div class="screen-body">
                    <div class="app-header">
                      <div class="avatar"></div>
                      <div class="header-text">
                        <div class="line w-50"></div>
                        <div class="line w-30 dim"></div>
                      </div>
                      <div class="bell">
                        <span class="bell-dot"></span>
                      </div>
                    </div>

                    <div class="card hero-card">
                      <div class="card-shape"></div>
                      <div class="line w-40 white"></div>
                      <div class="line w-70 white dim"></div>
                      <div class="card-btn">{{ lang.t('ابدأ', 'Start') }}</div>
                    </div>

                    <div class="grid-row">
                      <div class="grid-cell">
                        <div class="cell-icon" style="background: var(--grad-1);">📊</div>
                        <div class="line w-60 mini"></div>
                      </div>
                      <div class="grid-cell">
                        <div class="cell-icon" style="background: var(--grad-3);">📅</div>
                        <div class="line w-60 mini"></div>
                      </div>
                      <div class="grid-cell">
                        <div class="cell-icon" style="background: var(--grad-2);">🎯</div>
                        <div class="line w-60 mini"></div>
                      </div>
                    </div>

                    <div class="list-item">
                      <div class="thumb"></div>
                      <div style="flex:1">
                        <div class="line w-70 mini"></div>
                        <div class="line w-40 mini dim"></div>
                      </div>
                      <div class="chevron">›</div>
                    </div>
                    <div class="list-item">
                      <div class="thumb thumb-2"></div>
                      <div style="flex:1">
                        <div class="line w-60 mini"></div>
                        <div class="line w-50 mini dim"></div>
                      </div>
                      <div class="chevron">›</div>
                    </div>
                  </div>

                  <div class="tab-bar">
                    <div class="tab active">
                      <span>🏠</span>
                    </div>
                    <div class="tab"><span>🔍</span></div>
                    <div class="tab"><span>❤️</span></div>
                    <div class="tab"><span>👤</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- orbit ring + floating app icons -->
            <div class="orbit"></div>

            <div class="app-icon icon-1" style="background: linear-gradient(135deg, #ff4ecd, #7b5cff);">💬</div>
            <div class="app-icon icon-2" style="background: linear-gradient(135deg, #00d4ff, #2ee6a8);">🎵</div>
            <div class="app-icon icon-3" style="background: linear-gradient(135deg, #ffb547, #ff4ecd);">📷</div>
            <div class="app-icon icon-4" style="background: linear-gradient(135deg, #7b5cff, #00d4ff);">🛒</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      padding: 60px 0 80px;
      position: relative;
      overflow: hidden;
      min-height: 90vh;
      display: flex;
      align-items: center;
    }

    .bg-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.4;
      pointer-events: none;
      animation: blob-drift 18s ease-in-out infinite;
      transition: transform 0.6s var(--ease-out);
    }
    .blob-1 {
      width: 500px; height: 500px; background: var(--c1);
      top: -150px; inset-inline-end: -100px;
      transform: translate3d(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -20px), 0);
    }
    .blob-2 {
      width: 400px; height: 400px; background: var(--c2);
      bottom: -100px; inset-inline-start: -100px;
      animation-delay: -6s;
      transform: translate3d(calc(var(--mx, 0) * 25px), calc(var(--my, 0) * 25px), 0);
    }
    .blob-3 {
      width: 300px; height: 300px; background: var(--c3);
      top: 40%; inset-inline-start: 40%;
      animation-delay: -12s;
      transform: translate3d(calc(var(--mx, 0) * -15px), calc(var(--my, 0) * 15px), 0);
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 60px;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--surface-strong);
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-dim);
      margin-bottom: 24px;
    }
    .dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--c5);
      box-shadow: 0 0 10px var(--c5);
      animation: pulse-glow 1.5s ease-in-out infinite;
    }

    h1 {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 900;
      line-height: 1.1;
      margin: 0 0 8px;
    }
    .name {
      background: linear-gradient(135deg, #ff4ecd 0%, #7b5cff 25%, #00d4ff 50%, #7b5cff 75%, #ff4ecd 100%);
      background-size: 300% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: gradient-shift 6s ease-in-out infinite;
    }

    .role {
      font-size: clamp(1.4rem, 3vw, 2.2rem);
      font-weight: 800;
      color: var(--text);
      margin: 0 0 24px;
      line-height: 1.2;
    }
    .role-accent {
      background: var(--grad-2);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .tagline {
      font-size: 1.1rem;
      color: var(--text-dim);
      max-width: 520px;
      line-height: 1.7;
      margin: 0 0 36px;
    }

    .typed-row {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      margin: 4px 0 22px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      font-family: 'Space Grotesk', monospace;
      font-size: 0.95rem;
    }
    .typed-row .prompt {
      color: var(--text-mute);
      font-weight: 600;
    }
    .typed {
      color: var(--c3);
      font-weight: 800;
      min-height: 1.2em;
      display: inline-flex;
      align-items: center;
    }
    .caret {
      display: inline-block;
      color: var(--c1);
      font-weight: 400;
      margin-inline-start: 1px;
      animation: blink 1s steps(2) infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }

    .cta-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }

    .cv-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 22px;
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 14px;
      font-weight: 700;
      font-size: 0.92rem;
      transition: transform 0.3s var(--ease-bounce), background 0.3s, border-color 0.3s, box-shadow 0.3s;
    }
    .cv-btn:hover {
      transform: translateY(-3px);
      background: var(--surface-strong);
      border-color: var(--c5);
      box-shadow: 0 14px 30px -10px var(--c5);
      color: var(--c5);
    }
    .stats {
      display: flex;
      gap: 40px;
      padding-top: 32px;
      border-top: 1px solid var(--border);
    }
    .stat {
      transition: transform 0.3s var(--ease-out);
    }
    .stat:hover { transform: translateY(-4px); }
    .stat-num {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      background: var(--grad-3);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .stat-label { color: var(--text-mute); font-size: 0.9rem; }

    /* ----------- Phone mockup ----------- */
    .hero-visual { position: relative; height: 540px; }
    .device-stack {
      position: relative;
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      transform: translate3d(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 12px), 0);
      transition: transform 0.4s var(--ease-out);
    }

    .phone {
      position: absolute;
      animation: float 6s ease-in-out infinite;
    }
    .phone-front {
      z-index: 3;
      transform: translate(110px, 50px) rotate(-5deg);
    }
    html[dir='rtl'] .phone-front { transform: translate(-110px, 50px) rotate(5deg); }

    /* Laptop / web mockup */
    .laptop {
      position: absolute;
      z-index: 2;
      transform: translate(-40px, -40px);
      animation: float 6s ease-in-out infinite;
      animation-delay: -2s;
    }
    html[dir='rtl'] .laptop { transform: translate(40px, -40px); }
    .laptop-screen {
      width: 380px;
      height: 240px;
      background: linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%);
      border-radius: 12px 12px 4px 4px;
      padding: 10px 8px 8px;
      box-shadow:
        0 0 0 2px rgba(255,255,255,0.08),
        0 50px 100px -20px rgba(0,0,0,0.7),
        inset 0 1px 1px rgba(255,255,255,0.12);
      position: relative;
    }
    .laptop-base {
      width: 440px;
      height: 12px;
      background: linear-gradient(180deg, #2a2a3e, #15152a);
      border-radius: 0 0 14px 14px;
      margin-inline-start: -30px;
      box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6);
      position: relative;
    }
    .laptop-base::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 5px;
      background: rgba(0,0,0,0.55);
      border-radius: 0 0 8px 8px;
    }
    .browser-chrome {
      display: flex;
      align-items: center;
      gap: 6px;
      height: 20px;
      padding: 0 4px;
      margin-bottom: 6px;
    }
    .bdot {
      width: 10px; height: 10px; border-radius: 50%;
      flex-shrink: 0;
    }
    .bdot.r { background: #ff5f56; }
    .bdot.y { background: #ffbd2e; }
    .bdot.g { background: #27c93f; }
    .url-bar {
      flex: 1;
      height: 16px;
      background: rgba(255,255,255,0.08);
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0 8px;
      font-size: 0.55rem;
      color: var(--text-mute);
      margin-inline-start: 6px;
    }
    .lock { font-size: 0.55rem; opacity: 0.7; }
    .url-text { letter-spacing: 0.02em; }
    .browser-body {
      height: calc(100% - 26px);
      background: #0b0b1a;
      border-radius: 6px;
      padding: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .web-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .web-logo {
      width: 28px; height: 10px;
      background: var(--grad-3);
      border-radius: 3px;
    }
    .web-links { display: flex; gap: 8px; }
    .web-links span {
      width: 20px; height: 5px;
      background: var(--text);
      opacity: 0.4;
      border-radius: 2px;
    }
    .web-hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      align-items: center;
    }
    .web-text { display: flex; flex-direction: column; gap: 6px; }
    .web-btn {
      width: 56px; height: 14px;
      background: var(--grad-1);
      border-radius: 4px;
      margin-top: 6px;
    }
    .web-img {
      height: 76px;
      border-radius: 6px;
      background: var(--grad-2);
      position: relative;
      overflow: hidden;
    }
    .web-img::after {
      content: '';
      position: absolute;
      inset: 30%;
      border: 2px dashed rgba(255,255,255,0.5);
      border-radius: 50%;
      animation: ring-spin 18s linear infinite;
    }
    .web-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .web-card {
      height: 32px;
      background: var(--surface);
      border-radius: 6px;
      border: 1px solid var(--border);
    }
    .web-card:nth-child(1) { background: linear-gradient(135deg, var(--surface), rgba(255,78,205,0.15)); }
    .web-card:nth-child(2) { background: linear-gradient(135deg, var(--surface), rgba(0,212,255,0.15)); }
    .web-card:nth-child(3) { background: linear-gradient(135deg, var(--surface), rgba(123,92,255,0.15)); }

    .phone-frame {
      width: 240px;
      height: 480px;
      background: linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%);
      border-radius: 42px;
      padding: 10px;
      box-shadow:
        0 0 0 2px rgba(255,255,255,0.1),
        0 50px 100px -20px rgba(0,0,0,0.7),
        inset 0 1px 1px rgba(255,255,255,0.15);
      position: relative;
    }
    .phone-frame::before {
      content: '';
      position: absolute;
      top: 16%;
      inset-inline-start: -3px;
      width: 3px;
      height: 32px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px 0 0 2px;
    }
    .phone-frame::after {
      content: '';
      position: absolute;
      top: 28%;
      inset-inline-end: -3px;
      width: 3px;
      height: 56px;
      background: rgba(255,255,255,0.1);
      border-radius: 0 2px 2px 0;
    }

    .screen {
      width: 100%;
      height: 100%;
      background: #0b0b1a;
      border-radius: 32px;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .notch {
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: 90px;
      height: 22px;
      background: #000;
      border-radius: 0 0 12px 12px;
      z-index: 2;
    }

    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px 6px;
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text);
    }
    .status-icons { display: flex; gap: 4px; align-items: center; }
    .signal, .wifi, .battery {
      display: inline-block;
      background: var(--text);
      border-radius: 1px;
    }
    .signal { width: 12px; height: 8px; clip-path: polygon(0 100%, 25% 100%, 25% 75%, 50% 75%, 50% 50%, 75% 50%, 75% 25%, 100% 25%, 100% 100%); }
    .wifi { width: 11px; height: 8px; clip-path: polygon(0 70%, 50% 30%, 100% 70%, 80% 90%, 50% 70%, 20% 90%); }
    .battery { width: 22px; height: 10px; border-radius: 3px; position: relative; }
    .battery::after {
      content: '';
      position: absolute;
      inset-inline-end: -3px;
      top: 3px;
      width: 2px; height: 4px;
      background: var(--text);
      border-radius: 0 2px 2px 0;
    }

    .screen-body {
      flex: 1;
      padding: 12px 14px 0;
      overflow: hidden;
    }

    .app-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .avatar {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: var(--grad-3);
      flex-shrink: 0;
    }
    .header-text { flex: 1; display: flex; flex-direction: column; gap: 4px; }

    .line {
      height: 8px;
      background: var(--text);
      border-radius: 4px;
      opacity: 0.85;
    }
    .line.dim { opacity: 0.35; height: 6px; }
    .line.mini { height: 5px; }
    .line.white { background: #fff; }
    .line.w-30 { width: 30%; }
    .line.w-40 { width: 40%; }
    .line.w-50 { width: 50%; }
    .line.w-60 { width: 60%; }
    .line.w-70 { width: 70%; }

    .bell {
      width: 28px; height: 28px;
      border-radius: 8px;
      background: var(--surface-strong);
      display: grid;
      place-items: center;
      position: relative;
    }
    .bell::before {
      content: '🔔';
      font-size: 0.85rem;
    }
    .bell-dot {
      position: absolute;
      top: 4px; inset-inline-end: 4px;
      width: 6px; height: 6px;
      background: var(--c1);
      border-radius: 50%;
      box-shadow: 0 0 6px var(--c1);
      animation: pulse-glow 1.4s ease-in-out infinite;
    }

    .card.hero-card {
      background: var(--grad-1);
      border-radius: 16px;
      padding: 14px;
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
      overflow: hidden;
    }
    .card-shape {
      position: absolute;
      width: 70px; height: 70px;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      top: -20px;
      inset-inline-end: -20px;
    }
    .card-btn {
      align-self: flex-start;
      margin-top: 6px;
      padding: 5px 14px;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(10px);
      border-radius: 999px;
      font-size: 0.65rem;
      font-weight: 700;
      color: #fff;
      position: relative;
    }

    .grid-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 14px;
    }
    .grid-cell {
      background: var(--surface);
      border-radius: 12px;
      padding: 10px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .cell-icon {
      width: 32px; height: 32px;
      border-radius: 22.5%;
      display: grid;
      place-items: center;
      font-size: 0.95rem;
    }

    .list-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      background: var(--surface);
      border-radius: 12px;
      margin-bottom: 8px;
    }
    .thumb {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: var(--grad-3);
      flex-shrink: 0;
    }
    .thumb.thumb-2 { background: var(--grad-2); }
    .chevron {
      color: var(--text-mute);
      font-size: 1.2rem;
      font-weight: 600;
    }
    html[dir='rtl'] .chevron { transform: scaleX(-1); }

    .tab-bar {
      display: flex;
      justify-content: space-around;
      padding: 10px 8px 14px;
      background: rgba(20,20,43,0.95);
      border-top: 1px solid var(--border);
    }
    .tab {
      width: 36px; height: 36px;
      display: grid;
      place-items: center;
      font-size: 1.1rem;
      border-radius: 12px;
      opacity: 0.5;
      transition: 0.2s;
    }
    .tab.active {
      opacity: 1;
      background: var(--surface-strong);
    }

    /* Floating app icons */
    .orbit {
      position: absolute;
      inset: 50% 50%;
      width: 440px; height: 440px;
      transform: translate(-50%, -50%);
      border: 1px dashed rgba(255,255,255,0.08);
      border-radius: 50%;
      animation: ring-spin 40s linear infinite;
      z-index: 0;
    }
    html[dir='rtl'] .orbit { transform: translate(50%, -50%); }

    .app-icon {
      position: absolute;
      width: 56px; height: 56px;
      border-radius: 28%;
      display: grid;
      place-items: center;
      font-size: 1.7rem;
      box-shadow: 0 18px 36px -12px rgba(0,0,0,0.5);
      animation: float 5s ease-in-out infinite;
      z-index: 4;
      transition: transform 0.3s var(--ease-bounce), box-shadow 0.3s;
    }
    .app-icon:hover {
      transform: scale(1.15) rotate(-8deg);
      box-shadow: 0 30px 60px -10px var(--c1);
    }
    .icon-1 { top: 6%; inset-inline-start: 8%; animation-delay: 0s; }
    .icon-2 { top: 18%; inset-inline-end: 6%; animation-delay: 1s; }
    .icon-3 { bottom: 22%; inset-inline-start: 4%; animation-delay: 2s; }
    .icon-4 { bottom: 6%; inset-inline-end: 12%; animation-delay: 3s; }

    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr; gap: 40px; }
      .hero-visual { height: 460px; order: -1; }
      .phone-frame { width: 200px; height: 400px; }
      .phone-front { transform: translate(90px, 40px) rotate(-5deg); }
      html[dir='rtl'] .phone-front { transform: translate(-90px, 40px) rotate(5deg); }
      .laptop-screen { width: 320px; height: 200px; }
      .laptop-base { width: 370px; margin-inline-start: -25px; }
      .orbit { width: 360px; height: 360px; }
      .stats { gap: 24px; }
      .stat-num { font-size: 1.5rem; }
    }

    @media (max-width: 768px) {
      .bg-blob {
        filter: blur(40px);
        opacity: 0.25;
        animation: none;
      }
      .blob-1 { width: 280px; height: 280px; }
      .blob-2 { width: 240px; height: 240px; }
      .blob-3 { display: none; }
      .orbit { animation: none; }
      .name { animation: none; }
      .card-btn { backdrop-filter: none; -webkit-backdrop-filter: none; background: rgba(0,0,0,0.55); }
      .web-img::after { animation: none; }
    }

    @media (max-width: 520px) {
      .laptop { transform: translate(-20px, -50px); }
      html[dir='rtl'] .laptop { transform: translate(20px, -50px); }
      .laptop-screen { width: 260px; height: 170px; padding: 8px 6px 6px; }
      .laptop-base { width: 300px; margin-inline-start: -20px; height: 10px; }
      .phone-front { transform: translate(70px, 60px) rotate(-5deg); }
      html[dir='rtl'] .phone-front { transform: translate(-70px, 60px) rotate(5deg); }
      .browser-body { padding: 8px; gap: 7px; }
      .web-img { height: 56px; }
      .web-card { height: 24px; }
    }

    @media (max-width: 480px) {
      .cta-row { gap: 8px; }
    }
  `]
})
export class HeroComponent {
  protected lang = inject(LanguageService);
  @ViewChild('host', { static: true }) private host!: ElementRef<HTMLElement>;

  protected specialties = computed<string[]>(() =>
    this.lang.isAr()
      ? [
          'تطبيقات iOS و Android',
          'مواقع ومنصات ويب حديثة',
          'تجربة مستخدم سلسة',
          'تصاميم متجاوبة',
          'أداء عالي وسرعة'
        ]
      : [
          'iOS & Android apps',
          'Modern web platforms',
          'Smooth user experiences',
          'Responsive designs',
          'Fast, performant builds'
        ]
  );

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = this.host.nativeElement.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width - 0.5;
    const my = (e.clientY - rect.top) / rect.height - 0.5;
    this.host.nativeElement.style.setProperty('--mx', mx.toFixed(3));
    this.host.nativeElement.style.setProperty('--my', my.toFixed(3));
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.host.nativeElement.style.setProperty('--mx', '0');
    this.host.nativeElement.style.setProperty('--my', '0');
  }
}
