import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { SkillsComponent } from './components/skills/skills';
import { ExperienceComponent } from './components/experience/experience';
import { ProjectsComponent } from './components/projects/projects';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';
import { SplashComponent } from './components/splash/splash';
import { ScrollProgressComponent } from './components/scroll-progress/scroll-progress';
import { CursorGlowComponent } from './components/cursor-glow/cursor-glow';
import { TechMarqueeComponent } from './components/tech-marquee/tech-marquee';
import { ScrollTopComponent } from './components/scroll-top/scroll-top';
import { ActiveSectionService } from './services/active-section.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    ContactComponent,
    FooterComponent,
    SplashComponent,
    ScrollProgressComponent,
    CursorGlowComponent,
    TechMarqueeComponent,
    ScrollTopComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private active = inject(ActiveSectionService);
  // Eagerly initialize ThemeService so the theme attribute is applied early
  private theme = inject(ThemeService);

  ngOnInit() {
    this.active.init();
  }
}
