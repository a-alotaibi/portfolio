import { Component } from '@angular/core';

interface TechItem { name: string; emoji: string; }

@Component({
  selector: 'app-tech-marquee',
  standalone: true,
  template: `
    <div class="marquee-band" aria-hidden="true">
      <div class="marquee-track">
        @for (t of doubled; track $index) {
          <div class="t">
            <span class="t-emoji">{{ t.emoji }}</span>
            <span>{{ t.name }}</span>
          </div>
          <span class="dot-sep">●</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .marquee-band {
      position: relative;
      overflow: hidden;
      padding: 22px 0;
      margin: 32px 0 0;
      border-block: 1px solid var(--border);
      background:
        linear-gradient(90deg, var(--bg) 0%, transparent 8%, transparent 92%, var(--bg) 100%),
        linear-gradient(180deg, var(--surface) 0%, transparent 100%);
      mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
    }

    .marquee-track {
      display: flex;
      gap: 40px;
      width: max-content;
      animation: marquee-x 38s linear infinite;
      will-change: transform;
    }
    .marquee-band:hover .marquee-track { animation-play-state: paused; }

    .t {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-dim);
      transition: color 0.3s;
      white-space: nowrap;
    }
    .t:hover { color: var(--text); }

    .t-emoji {
      font-size: 1.6rem;
      filter: drop-shadow(0 4px 10px rgba(123, 92, 255, 0.4));
    }

    .dot-sep {
      color: var(--c2);
      font-size: 0.5rem;
      align-self: center;
      opacity: 0.6;
    }

    @media (prefers-reduced-motion: reduce) {
      .marquee-track { animation: none; }
    }
  `]
})
export class TechMarqueeComponent {
  protected items: TechItem[] = [
    { name: 'Swift',     emoji: '🦅' },
    { name: 'SwiftUI',   emoji: '🍎' },
    { name: 'Kotlin',    emoji: '🤖' },
    { name: 'Jetpack Compose', emoji: '🟢' },
    { name: 'Flutter',   emoji: '💙' },
    { name: 'React Native', emoji: '⚛️' },
    { name: 'Angular',   emoji: '🅰️' },
    { name: 'Next.js',   emoji: '▲' },
    { name: 'React',     emoji: '⚛️' },
    { name: 'TypeScript', emoji: '🟦' },
    { name: 'Tailwind',  emoji: '🎨' },
    { name: 'SCSS',      emoji: '💗' },
    { name: 'Figma',     emoji: '🖌️' },
    { name: 'Git',       emoji: '🔀' },
    { name: 'Xcode',     emoji: '🛠️' },
    { name: 'Android Studio', emoji: '🤖' }
  ];

  // Duplicate the items so the loop is seamless (translateX 0 to -50%)
  protected doubled = [...this.items, ...this.items];
}
