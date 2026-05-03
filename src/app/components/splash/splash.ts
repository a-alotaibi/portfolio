import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-splash',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="splash" [class.hide]="hiding()">
        <div class="content">
          <div class="logo">
            <img src="logo.png" alt="Abdulaziz logo" width="120" height="120">
          </div>
          <div class="brand">Abdulaziz</div>
          <div class="subtitle">Apps · Web · Systems</div>
        </div>
        <div class="loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    }
  `,
  styles: [`
    .splash {
      position: fixed;
      inset: 0;
      background: linear-gradient(180deg, #0b0b1a 0%, #14142b 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      gap: 36px;
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .splash.hide { opacity: 0; transform: scale(1.05); pointer-events: none; }

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .logo {
      width: 120px; height: 120px;
      display: grid;
      place-items: center;
      filter: drop-shadow(0 30px 60px rgba(123, 92, 255, 0.6));
      animation: breathe 2.4s ease-in-out infinite;
      margin-bottom: 24px;
    }
    .logo img {
      width: 100%;
      height: 100%;
      display: block;
    }

    .brand {
      font-size: 1.6rem;
      font-weight: 800;
      color: #f4f4ff;
      margin-bottom: 4px;
    }
    .subtitle {
      font-size: 0.9rem;
      color: #8888a8;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .loader {
      display: flex;
      gap: 8px;
    }
    .loader span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #7b5cff;
      animation: bounce 1.2s ease-in-out infinite;
    }
    .loader span:nth-child(2) { animation-delay: 0.2s; background: #ff4ecd; }
    .loader span:nth-child(3) { animation-delay: 0.4s; background: #00d4ff; }

    @keyframes pop {
      0% { opacity: 0; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.06); }
    }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.5); opacity: 0.5; }
      40% { transform: scale(1.2); opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .splash, .content, .logo, .loader span { animation: none !important; }
      .splash.hide { opacity: 0; }
    }
  `]
})
export class SplashComponent implements OnInit {
  protected readonly visible = signal(true);
  protected readonly hiding = signal(false);

  ngOnInit() {
    setTimeout(() => this.hiding.set(true), 1100);
    setTimeout(() => this.visible.set(false), 1700);
  }
}
