import { Component, HostListener, effect, inject, signal } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { ActiveSectionService } from '../../services/active-section.service';

interface NavLink { id: string; ar: string; en: string; }

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="nav" [class.scrolled]="scrolled()">
      <a class="logo" href="#home" (click)="closeMenu()">
        <img class="logo-mark" src="logo.png" alt="Abdulaziz" width="36" height="36">
        <span class="logo-text">{{ lang.t('عبدالعزيز', 'Abdulaziz') }}</span>
      </a>

      <ul class="links">
        @for (l of links; track l.id) {
          <li>
            <a [href]="'#' + l.id" [class.active]="active.active() === l.id">
              {{ lang.isAr() ? l.ar : l.en }}
            </a>
          </li>
        }
      </ul>

      <div class="actions">
        <button class="icon-btn theme-btn" (click)="theme.toggle()" [attr.aria-label]="lang.t('تبديل الثيم', 'Toggle theme')">
          @if (theme.theme() === 'dark') {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          } @else {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          }
        </button>
        <button class="icon-btn lang-btn" (click)="lang.toggle()" [attr.aria-label]="lang.t('تغيير اللغة', 'Change language')">
          <span>{{ lang.isAr() ? 'EN' : 'ع' }}</span>
        </button>
        <button class="icon-btn burger" [class.open]="menuOpen()" (click)="toggleMenu()" [attr.aria-label]="lang.t('القائمة', 'Menu')" [attr.aria-expanded]="menuOpen()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>

    <div class="mobile-menu" [class.open]="menuOpen()" (click)="closeMenu()">
      <div class="menu-inner" (click)="$event.stopPropagation()">
        <ul class="menu-links">
          @for (l of links; track l.id; let i = $index) {
            <li [style.--i]="i">
              <a [href]="'#' + l.id" [class.active]="active.active() === l.id" (click)="closeMenu()">
                <span class="menu-num">0{{ i + 1 }}</span>
                <span>{{ lang.isAr() ? l.ar : l.en }}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </a>
            </li>
          }
        </ul>
        <div class="menu-footer">
          <button class="m-btn" (click)="theme.toggle()">
            {{ theme.theme() === 'dark' ? lang.t('وضع فاتح', 'Light mode') : lang.t('وضع داكن', 'Dark mode') }}
          </button>
          <button class="m-btn" (click)="lang.toggle()">
            {{ lang.isAr() ? 'English' : 'العربية' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: sticky;
      top: 0;
      z-index: 50;
      display: block;
      animation: slide-down 0.7s var(--ease-out) both;
    }

    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 14px 28px;
      margin: 16px auto;
      max-width: 1200px;
      background: rgba(20, 20, 43, 0.65);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      border-radius: 999px;
      box-shadow: 0 10px 40px -10px rgba(0,0,0,0.4);
      transition: box-shadow 0.4s, border-color 0.4s, padding 0.3s, background 0.4s;
    }
    html[data-theme='light'] .nav {
      background: rgba(255,255,255,0.75);
      box-shadow: 0 10px 30px -10px rgba(20,20,43,0.15);
    }
    .nav.scrolled { padding: 10px 24px; }

    .logo {
      display: flex; align-items: center; gap: 10px;
      font-weight: 800; font-size: 1.05rem;
      transition: transform 0.3s var(--ease-bounce);
    }
    .logo:hover { transform: translateY(-2px); }
    .logo:hover .logo-mark { transform: rotate(-12deg) scale(1.08); }
    .logo-mark {
      width: 36px; height: 36px;
      display: block;
      filter: drop-shadow(0 8px 20px rgba(123, 92, 255, 0.5));
      transition: transform 0.4s var(--ease-bounce);
    }

    .links {
      display: flex; gap: 4px;
      list-style: none; margin: 0; padding: 0;
    }
    .links a {
      position: relative;
      padding: 8px 16px;
      border-radius: 999px;
      color: var(--text-dim);
      font-weight: 600;
      font-size: 0.92rem;
      transition: color 0.25s, background 0.25s, transform 0.25s var(--ease-bounce);
    }
    .links a::before {
      content: '';
      position: absolute;
      inset: auto 50% -2px 50%;
      width: 0;
      height: 2px;
      background: var(--grad-1);
      border-radius: 2px;
      transition: width 0.35s var(--ease-out), inset 0.35s var(--ease-out);
    }
    .links a:hover {
      color: var(--text);
      background: var(--surface);
      transform: translateY(-2px);
    }
    .links a:hover::before { width: 60%; inset: auto 20% -2px 20%; }
    .links a.active {
      color: var(--text);
      background: var(--surface-strong);
    }
    .links a.active::before { width: 50%; inset: auto 25% -2px 25%; }

    .actions { display: flex; gap: 8px; align-items: center; }

    .icon-btn {
      width: 40px; height: 40px;
      display: grid;
      place-items: center;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      border-radius: 50%;
      font-weight: 700;
      font-size: 0.85rem;
      transition: transform 0.4s var(--ease-bounce), background 0.3s, border-color 0.3s, box-shadow 0.3s;
    }
    .icon-btn:hover {
      transform: translateY(-2px) scale(1.08);
      border-color: var(--c2);
    }

    .theme-btn:hover { color: var(--c4); }

    .lang-btn:hover {
      background: var(--grad-1);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 10px 30px -10px var(--c1);
    }

    .burger { display: none; flex-direction: column; gap: 5px; padding: 10px; }
    .burger span {
      display: block;
      width: 18px; height: 2px;
      background: currentColor;
      border-radius: 2px;
      transition: 0.3s var(--ease-out);
    }
    .burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .burger.open span:nth-child(2) { opacity: 0; }
    .burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* Mobile menu overlay */
    .mobile-menu {
      position: fixed;
      inset: 0;
      background: rgba(11,11,26,0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 40;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s var(--ease-out);
    }
    html[data-theme='light'] .mobile-menu {
      background: rgba(246,247,251,0.92);
    }
    .mobile-menu.open { opacity: 1; pointer-events: auto; }

    .menu-inner {
      position: absolute;
      inset: 100px 16px auto 16px;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px;
      transform: translateY(-20px) scale(0.95);
      transition: transform 0.4s var(--ease-bounce);
    }
    .mobile-menu.open .menu-inner { transform: translateY(0) scale(1); }

    .menu-links {
      list-style: none;
      padding: 0;
      margin: 0 0 16px;
    }
    .menu-links li {
      opacity: 0;
      transform: translateY(15px);
      transition: opacity 0.4s, transform 0.4s var(--ease-bounce);
      transition-delay: calc(var(--i) * 60ms + 100ms);
    }
    .mobile-menu.open .menu-links li { opacity: 1; transform: translateY(0); }
    .menu-links a {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      border-radius: var(--radius);
      color: var(--text);
      font-weight: 700;
      font-size: 1.1rem;
      border: 1px solid transparent;
      transition: 0.25s;
    }
    .menu-links a:hover, .menu-links a.active {
      background: var(--surface);
      border-color: var(--border);
    }
    .menu-links a.active { color: var(--c2); }
    .menu-num {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      color: var(--text-mute);
      font-weight: 700;
    }
    .menu-links a > svg {
      margin-inline-start: auto;
      opacity: 0.5;
      transition: 0.2s;
    }
    html[dir='rtl'] .menu-links a > svg { transform: scaleX(-1); }
    .menu-links a:hover > svg { opacity: 1; transform: translateX(4px); }
    html[dir='rtl'] .menu-links a:hover > svg { transform: scaleX(-1) translateX(4px); }

    .menu-footer {
      display: flex;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    .m-btn {
      flex: 1;
      padding: 12px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 14px;
      font-weight: 700;
      font-size: 0.9rem;
      transition: 0.25s;
    }
    .m-btn:hover {
      background: var(--surface-strong);
      transform: translateY(-2px);
      border-color: var(--c2);
    }

    @media (max-width: 920px) {
      .nav { margin: 8px 12px; padding: 10px 16px; }
      .links { display: none; }
      .burger { display: flex; }
    }
  `]
})
export class NavbarComponent {
  protected lang = inject(LanguageService);
  protected theme = inject(ThemeService);
  protected active = inject(ActiveSectionService);

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  protected links: NavLink[] = [
    { id: 'home', ar: 'الرئيسية', en: 'Home' },
    { id: 'about', ar: 'عني', en: 'About' },
    { id: 'skills', ar: 'المهارات', en: 'Skills' },
    { id: 'projects', ar: 'التطبيقات', en: 'Apps' },
    { id: 'contact', ar: 'تواصل', en: 'Contact' }
  ];

  constructor() {
    effect(() => {
      if (typeof document === 'undefined') return;
      document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
  }

  toggleMenu() { this.menuOpen.update((o) => !o); }
  closeMenu() { this.menuOpen.set(false); }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 20);
  }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.menuOpen()) this.closeMenu(); }
}
