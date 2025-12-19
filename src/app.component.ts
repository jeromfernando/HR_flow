import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class AppComponent {
  dataService = inject(DataService);
  sidebarOpen = signal(true);
  currentRoute = signal('');

  jobsCount = computed(() => this.dataService.jobs().filter(j => j.status === 'Published').length);
  candidatesCount = computed(() => this.dataService.candidates().length);
  onboardingCount = computed(() => this.dataService.onboardingProcesses().length);
  offboardingCount = computed(() => this.dataService.offboardingProcesses().length);
  gigsCount = computed(() => this.dataService.gigs().filter(g => g.status === 'Open').length);

  navLinks = computed(() => [
    { section: 'MAIN' },
    { path: '/dashboard', icon: 'home', label: 'Dashboard' },
    { section: 'RECRUITMENT' },
    { path: '/jobs', icon: 'briefcase', label: 'Jobs', count: this.jobsCount() },
    { path: '/pipeline', icon: 'users', label: 'Candidates', count: this.candidatesCount() },
    { section: 'EMPLOYEE LIFECYCLE' },
    { path: '/lifecycle', fragment: 'onboarding', icon: 'onboarding', label: 'Onboarding', count: this.onboardingCount() },
    { path: '/lifecycle', fragment: 'offboarding', icon: 'offboarding', label: 'Offboarding', count: this.offboardingCount() },
    { section: 'MARKETPLACE' },
    { path: '/talent', icon: 'star', label: 'Talent Marketplace', count: this.gigsCount() },
  ]);
  
  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute.set(event.urlAfterRedirects);
    });
  }

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }
  
  isLinkActive(path: string): boolean {
    return this.currentRoute() === path;
  }
}
