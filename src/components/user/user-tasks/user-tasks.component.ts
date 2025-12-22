import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-user-tasks',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">My Tasks</h1>

      @if (!hasActiveProcess()) {
          <div class="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
              <p>You don't have any pending Onboarding or Offboarding tasks.</p>
          </div>
      }

      @if (onboardingProcess(); as process) {
        <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
           <div class="px-6 py-4 border-b border-gray-200 bg-teal-50">
               <h2 class="text-lg font-medium text-teal-900">Onboarding Checklist</h2>
               <p class="text-sm text-teal-600">Start Date: {{ process.startDate }}</p>
           </div>
           <ul class="divide-y divide-gray-200">
               @for (task of process.tasks; track task.id) {
                   <li class="px-6 py-4 flex items-center justify-between">
                       <div class="flex items-center">
                           <div [class]="'flex-shrink-0 h-2 w-2 rounded-full ' + (task.status === 'Completed' ? 'bg-green-400' : 'bg-gray-300')"></div>
                           <div class="ml-4">
                               <p class="text-sm font-medium text-gray-900">{{ task.name }}</p>
                               <p class="text-sm text-gray-500">{{ task.description }}</p>
                           </div>
                       </div>
                       <div>
                           <span [class]="'px-2 py-1 text-xs font-semibold rounded-full ' + (task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')">
                               {{ task.status }}
                           </span>
                       </div>
                   </li>
               }
           </ul>
        </div>
      }

      @if (offboardingProcess(); as process) {
        <div class="bg-white shadow rounded-lg overflow-hidden">
           <div class="px-6 py-4 border-b border-gray-200 bg-orange-50">
               <h2 class="text-lg font-medium text-orange-900">Offboarding Checklist</h2>
               <p class="text-sm text-orange-600">Last Day: {{ process.lastDay }}</p>
           </div>
           <ul class="divide-y divide-gray-200">
               @for (task of process.tasks; track task.id) {
                   <li class="px-6 py-4 flex items-center justify-between">
                       <div class="flex items-center">
                           <div [class]="'flex-shrink-0 h-2 w-2 rounded-full ' + (task.status === 'Completed' ? 'bg-green-400' : 'bg-gray-300')"></div>
                           <div class="ml-4">
                               <p class="text-sm font-medium text-gray-900">{{ task.name }}</p>
                               <p class="text-sm text-gray-500">{{ task.description }}</p>
                           </div>
                       </div>
                       <div>
                           <span [class]="'px-2 py-1 text-xs font-semibold rounded-full ' + (task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')">
                               {{ task.status }}
                           </span>
                       </div>
                   </li>
               }
           </ul>
        </div>
      }
    </div>
  `
})
export class UserTasksComponent {
    dataService = inject(DataService);
    auth = inject(AuthService);

    onboardingProcess = computed(() => {
        const user = this.auth.currentUser();
        // Match loosely by name since we don't have email in Process model widely yet, 
        // but in DataService addOnboardingProcess we passed email. 
        // For this prototype, matching by Name is simplest if email isn't strictly stored in the model interface for listing.
        // Ideally we should match by ID or Email. Let's try name match or assume first for demo if name matches.
        if (!user) return null;
        return this.dataService.onboardingProcesses().find(p => p.employeeName === user.name);
    });

    offboardingProcess = computed(() => {
        const user = this.auth.currentUser();
        if (!user) return null;
        return this.dataService.offboardingProcesses().find(p => p.employeeName === user.name);
    });

    hasActiveProcess = computed(() => !!this.onboardingProcess() || !!this.offboardingProcess());
}
