import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { Job } from '../../../models';

@Component({
  selector: 'app-user-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Open Positions</h1>
        <div class="w-64">
           <input [(ngModel)]="searchTerm" placeholder="Search jobs..." class="w-full px-4 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500">
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @for (job of filteredJobs(); track job.id) {
          <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div class="p-6">
              <div class="flex items-center justify-between">
                 <h3 class="text-lg font-medium text-gray-900">{{ job.title }}</h3>
                 <span class="px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">{{ job.department }}</span>
              </div>
              <div class="mt-2 text-sm text-gray-500">
                <p>{{ job.location }} • {{ job.experience }} exp</p>
                <p class="mt-1">{{ job.salaryMin | currency }} - {{ job.salaryMax | currency }}</p>
              </div>
              
              <div class="mt-4 flex flex-wrap gap-2">
                 @for (skill of job.skills.slice(0, 3); track skill) {
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {{ skill }}
                    </span>
                 }
                 @if (job.skills.length > 3) {
                     <span class="text-xs text-gray-500 self-center">+{{ job.skills.length - 3 }} more</span>
                 }
              </div>

              <div class="mt-6">
                <button (click)="openApplyModal(job)" class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Application Modal -->
      @if (selectedJob()) {
        <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="closeModal()"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Apply for {{ selectedJob()?.title }}
                    </h3>
                    <div class="mt-4 space-y-4">
                       <div>
                         <label class="block text-sm font-medium text-gray-700">Full Name</label>
                         <input [(ngModel)]="appName" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                       </div>
                       <div>
                         <label class="block text-sm font-medium text-gray-700">Email</label>
                         <input [(ngModel)]="appEmail" type="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                       </div>
                       <div>
                       <div>
                         <label class="block text-sm font-medium text-gray-700">Experience (Years)</label>
                         <input [(ngModel)]="appExp" type="number" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                       </div>
                        <div>
                         <label class="block text-sm font-medium text-gray-700">Skills (Comma separated)</label>
                         <input [(ngModel)]="appSkills" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="React, Node.js, SQL">
                       </div>
                       <div>
                         <label class="block text-sm font-medium text-gray-700">Upload CV/Resume</label>
                         <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-teal-500 transition-colors">
                           <div class="space-y-1 text-center">
                             <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                               <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                             </svg>
                             <div class="flex text-sm text-gray-600">
                               <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                                 <span>Upload a file</span>
                                 <input id="file-upload" name="file-upload" type="file" class="sr-only" (change)="onFileSelected($event)">
                               </label>
                               <p class="pl-1">or drag and drop</p>
                             </div>
                             <p class="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                             <p *ngIf="uploadedFileName()" class="text-sm text-teal-600 font-semibold pt-2">{{ uploadedFileName() }}</p>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button (click)="submitApplication()" [disabled]="!isValid()" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                  Submit Application
                </button>
                <button (click)="closeModal()" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
    </div>
  `
})
export class UserJobsComponent {
  dataService = inject(DataService);
  auth = inject(AuthService);

  searchTerm = signal('');
  selectedJob = signal<Job | null>(null);

  // Form fields
  appName = signal('');
  appEmail = signal('');
  appExp = signal<number | null>(null);
  appSkills = signal('');
  uploadedFileName = signal('');
  resumeUrl = signal('');

  filteredJobs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.dataService.jobs()
      .filter(j => j.status === 'Published')
      .filter(j => j.title.toLowerCase().includes(term) || j.department.toLowerCase().includes(term));
  });

  constructor() {
    // Pre-fill if logged in
    const user = this.auth.currentUser();
    if (user && user.role === 'Candidate') {
      this.appName.set(user.name);
      this.appEmail.set(user.email);
    }
  }

  openApplyModal(job: Job) {
    this.selectedJob.set(job);
    // Reset form if not pre-filled
    if (!this.auth.currentUser()) {
      this.appName.set('');
      this.appEmail.set('');
    }
    this.uploadedFileName.set('');
    this.resumeUrl.set('');
    this.appExp.set(null);
    this.appSkills.set('');
  }

  closeModal() {
    this.selectedJob.set(null);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFileName.set(file.name);
      // Simulate upload URL
      this.resumeUrl.set(URL.createObjectURL(file));
    }
  }

  isValid() {
    return this.appName() && this.appEmail() && this.appExp() && this.appSkills() && this.uploadedFileName();
  }

  submitApplication() {
    const job = this.selectedJob();
    if (job) {
      this.dataService.addCandidate({
        jobId: job.id,
        name: this.appName(),
        email: this.appEmail(),
        experience: this.appExp() || 0,
        skills: this.appSkills().split(',').map(s => s.trim()),
        phone: '123-456-7890', // Default for now
        resumeUrl: this.resumeUrl() || '#',
        rating: 0
      });
      this.closeModal();
      alert('Application Submitted Successfully!');
    }
  }
}
