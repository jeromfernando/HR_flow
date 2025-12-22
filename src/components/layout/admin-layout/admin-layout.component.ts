import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-admin-layout',
    template: `
    <div class="flex h-screen bg-slate-100 font-sans">
      <!-- Sidebar -->
      <aside 
        [class]="'flex-shrink-0 bg-slate-800 text-slate-300 transition-all duration-300 ease-in-out ' + (sidebarOpen() ? 'w-64' : 'w-20')"
      >
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div class="flex items-center h-16 px-4">
            <div class="flex items-center">
                <svg class="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              @if (sidebarOpen()) {
                <div class="ml-2">
                  <span class="text-xl font-bold text-white">HRFlow</span>
                  <p class="text-xs text-slate-400 -mt-1">HR Platform</p>
                </div>
              }
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="flex-1 px-3 py-4 space-y-1">
            @for (link of navLinks(); track link) {
              @if (link.section) {
                <h3 [class]="'px-3 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider ' + (sidebarOpen() ? '' : 'text-center')">
                  {{ sidebarOpen() ? link.section : '•' }}
                </h3>
              } @else {
                <a 
                  [routerLink]="link.path"
                  [fragment]="link.fragment"
                  routerLinkActive="bg-teal-400 text-slate-900 font-semibold"
                  [routerLinkActiveOptions]="{exact: link.path === '/admin/dashboard'}"
                  [class]="'flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md hover:bg-slate-700 hover:text-white transition-colors duration-200 ' + (sidebarOpen() ? '' : 'justify-center')"
                  [title]="sidebarOpen() ? '' : link.label"
                >
                  <div class="flex items-center">
                      @if (link.icon === 'home') {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                      }
                      @if (link.icon === 'briefcase') {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      }
                      @if (link.icon === 'users') {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.598m-1.5.003A9.37 9.37 0 018.624 15c-2.331 0-4.512.645-6.374 1.766l-.001.109a6.375 6.375 0 0011.964 4.598 12.348 12.348 0 00-3.263-4.598m1.5-.003h-.001M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      }
                      @if (link.icon === 'onboarding') {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                      }
                      @if (link.icon === 'offboarding') {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"></path></svg>
                      }
                      @if (link.icon === 'star') {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                      }
                    @if (sidebarOpen()) {
                      <span class="ml-3">{{ link.label }}</span>
                    }
                  </div>
                  @if (sidebarOpen() && link.count) {
                    <span class="px-2 py-0.5 text-xs font-semibold text-slate-300 bg-slate-600 rounded-full">{{ link.count }}</span>
                  }
                </a>
              }
            }
          </nav>

          <!-- Sidebar Toggle -->
          <div class="p-3 mt-auto border-t border-slate-700">
            <button (click)="toggleSidebar()" class="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white">
               @if (sidebarOpen()) {
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                Collapse
               } @else {
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
               }
            </button>
          </div>
        </div>
      </aside>

      <!-- Main area -->
      <div class="flex flex-col flex-1 overflow-hidden">
        <!-- Header -->
        <header class="flex items-center justify-between flex-shrink-0 h-16 px-6 bg-white border-b border-slate-200">
          <!-- Search -->
          <div class="relative w-full max-w-xs">
            <svg class="absolute w-5 h-5 text-slate-400 left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search candidates, jobs, tasks..." class="w-full py-2 pl-10 pr-4 text-sm bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
          </div>
          
          <!-- Right side icons and profile -->
          <div class="flex items-center space-x-5">
            <button class="relative p-2 text-slate-500 rounded-full hover:bg-slate-100 hover:text-slate-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span class="absolute top-1.5 right-1.5 flex items-center justify-center h-4 w-4 text-xs text-white bg-red-500 rounded-full">3</span>
            </button>
             <button class="p-2 text-slate-500 rounded-full hover:bg-slate-100 hover:text-slate-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
            <div class="flex items-center space-x-3 cursor-pointer" (click)="auth.logout()">
                <img class="w-9 h-9 rounded-full" [src]="auth.currentUser()?.avatar || 'https://i.pravatar.cc/150?u=hradmin'" alt="Admin avatar">
                <div class="hidden text-sm md:block">
                    <p class="font-semibold text-slate-800">{{ auth.currentUser()?.name }}</p>
                    <p class="text-xs text-slate-500">Administrator</p>
                </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
          <div class="container px-6 py-8 mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class AdminLayoutComponent {
    dataService = inject(DataService);
    auth = inject(AuthService);
    sidebarOpen = signal(true);
    currentRoute = signal('');

    jobsCount = computed(() => this.dataService.jobs().filter(j => j.status === 'Published').length);
    candidatesCount = computed(() => this.dataService.candidates().length);
    onboardingCount = computed(() => this.dataService.onboardingProcesses().length);
    offboardingCount = computed(() => this.dataService.offboardingProcesses().length);
    gigsCount = computed(() => this.dataService.gigs().filter(g => g.status === 'Open').length);

    navLinks = computed(() => [
        { section: 'MAIN' },
        { path: '/admin/dashboard', icon: 'home', label: 'Dashboard' },
        { section: 'RECRUITMENT' },
        { path: '/admin/jobs', icon: 'briefcase', label: 'Jobs', count: this.jobsCount() },
        { path: '/admin/pipeline', icon: 'users', label: 'Candidates', count: this.candidatesCount() },
        { section: 'EMPLOYEE LIFECYCLE' },
        { path: '/admin/lifecycle', fragment: 'onboarding', icon: 'onboarding', label: 'Onboarding', count: this.onboardingCount() },
        { path: '/admin/lifecycle', fragment: 'offboarding', icon: 'offboarding', label: 'Offboarding', count: this.offboardingCount() },
        { section: 'MARKETPLACE' },
        { path: '/admin/talent', icon: 'star', label: 'Talent Marketplace', count: this.gigsCount() },
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
}
