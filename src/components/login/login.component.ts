import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
             <svg class="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">HRFlow Portal</h2>
        <p class="mt-2 text-center text-sm text-slate-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          <div class="space-y-6">
            
            <!-- Admin Login -->
            <div>
              <button (click)="loginAdmin()" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors">
                Login as HR Admin
              </button>
            </div>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or continue as Candidate</span>
              </div>
            </div>

            <!-- Candidate Login -->
            <div class="space-y-4">
              <div>
                <label htmlFor="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                <input [(ngModel)]="candidateName" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="John Doe">
              </div>
              <div>
                <label htmlFor="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input [(ngModel)]="candidateEmail" type="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="john@example.com">
              </div>
              <button [disabled]="!candidateName() || !candidateEmail()" (click)="loginCandidate()" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Login as Candidate
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
    auth = inject(AuthService);

    candidateName = signal('');
    candidateEmail = signal('');

    loginAdmin() {
        this.auth.loginAsAdmin();
    }

    loginCandidate() {
        if (this.candidateName() && this.candidateEmail()) {
            this.auth.loginAsCandidate(this.candidateEmail(), this.candidateName());
        }
    }
}
