import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-user-applications',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">My Applications</h1>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          @for (app of myApplications(); track app.id) {
            <li>
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-teal-600 truncate">
                    {{ app.jobTitle }}
                  </p>
                  <div class="ml-2 flex-shrink-0 flex">
                    <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {{ app.stage }}
                    </p>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      {{ app.jobDept }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Applied on {{ app.appliedDate }}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          }
          @if (myApplications().length === 0) {
              <li class="px-4 py-8 text-center text-gray-500">
                  You haven't applied to any jobs yet.
              </li>
          }
        </ul>
      </div>
    </div>
  `
})
export class UserApplicationsComponent {
    dataService = inject(DataService);
    auth = inject(AuthService);

    myApplications = computed(() => {
        const userEmail = this.auth.currentUser()?.email;
        if (!userEmail) return [];

        return this.dataService.candidates()
            .filter(c => c.email === userEmail)
            .map(c => {
                const job = this.dataService.jobs().find(j => j.id === c.jobId);
                return {
                    ...c,
                    jobTitle: job?.title || 'Unknown Job',
                    jobDept: job?.department
                };
            });
    });
}
