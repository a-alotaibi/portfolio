import { Injectable, signal, computed, effect } from '@angular/core';

export type Lang = 'ar' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<Lang>('ar');
  readonly dir = computed(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));
  readonly isAr = computed(() => this.lang() === 'ar');

  constructor() {
    effect(() => {
      const html = document.documentElement;
      html.setAttribute('lang', this.lang());
      html.setAttribute('dir', this.dir());
    });
  }

  toggle() {
    this.lang.set(this.lang() === 'ar' ? 'en' : 'ar');
  }

  t(ar: string, en: string): string {
    return this.lang() === 'ar' ? ar : en;
  }
}
