import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-user-gigs',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Internal Talent Marketplace</h1>
      <p class="text-gray-500">Explore short-term gigs and internal rotations.</p>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @for (gig of availableGigs(); track gig.id) {
          <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow flex flex-col h-full">
            <div class="p-6 flex-1">
              <div class="flex items-center justify-between mb-4">
                 <span class="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">{{ gig.department }}</span>
                 <span class="text-sm text-gray-500">{{ gig.duration }}</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ gig.title }}</h3>
              <p class="text-sm text-gray-600 mb-4">{{ gig.description }}</p>
              
              <div class="flex flex-wrap gap-2 mb-4">
                 @for (skill of gig.skills; track skill) {
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {{ skill }}
                    </span>
                 }
              </div>
            </div>
            
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
                @if (hasApplied(gig.id)) {
                    <button disabled class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 cursor-default">
                        Applied
                    </button>
                } @else {
                    <button (click)="apply(gig.id)" class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Apply for Gig
                    </button>
                }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class UserGigsComponent {
    dataService = inject(DataService);
    auth = inject(AuthService);

    availableGigs = computed(() => this.dataService.gigs().filter(g => g.status === 'Open'));

    hasApplied(gigId: number) {
        const gig = this.dataService.gigs().find(g => g.id === gigId);
        const userName = this.auth.currentUser()?.name;
        return gig?.applicantsList?.some(a => a.name === userName);
    }

    apply(gigId: number) {
        const user = this.auth.currentUser();
        if (!user) return;

        this.dataService.addGigApplicant(gigId, user.name);

        // Auto-notify user
        this.dataService.sendMessage(
            user.email,
            'Gig Application Received',
            `You have successfully applied for the internal gig.`
            // Note: In real app, would lookup gig title here for clearer msg
        );
    }
}
