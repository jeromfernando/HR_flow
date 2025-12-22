import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';


@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans">
      <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <svg class="h-8 w-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                <span class="ml-2 text-xl font-bold text-gray-900">HRFlow Portal</span>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a routerLink="/portal/jobs" routerLinkActive="border-teal-500 text-gray-900" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full">
                  Jobs Board
                </a>
                <a routerLink="/portal/gigs" routerLinkActive="border-teal-500 text-gray-900" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full">
                  Internal Gigs
                </a>
                <a routerLink="/portal/applications" routerLinkActive="border-teal-500 text-gray-900" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full">
                  My Applications
                </a>
                <a routerLink="/portal/tasks" routerLinkActive="border-teal-500 text-gray-900" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full">
                  My Tasks
                </a>
                <a routerLink="/portal/inbox" routerLinkActive="border-teal-500 text-gray-900" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full">
                  Inbox
                  @if (unreadCount() > 0) {
                      <span class="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">{{ unreadCount() }}</span>
                  }
                </a>
              </div>
            </div>
            <div class="flex items-center">
              <div class="ml-3 relative flex items-center gap-4">
                 @if (auth.currentUser()) {
                     <div class="flex items-center gap-2">
                        <img [src]="auth.currentUser()?.avatar" class="w-8 h-8 rounded-full bg-gray-200">
                        <span class="text-sm font-medium text-gray-700">{{ auth.currentUser()?.name }}</span>
                     </div>
                     <button (click)="auth.logout()" class="ml-4 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">
                        Logout
                     </button>
                 } @else {
                    <a routerLink="/login" class="text-sm font-medium text-teal-600 hover:text-teal-500">Login</a>
                 }
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div class="py-10">
        <main>
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class UserLayoutComponent {

  auth = inject(AuthService);
  dataService = inject(DataService);

  public unreadCount = computed(() => {
    const email = this.auth.currentUser()?.email;
    return this.dataService.messages().filter(m => m.recipientEmail === email && !m.read).length;
  });
}
