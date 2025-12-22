import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { RecruitmentPipelineVisualComponent } from '../../shared/recruitment-pipeline-visual/recruitment-pipeline-visual.component';
import { Candidate, CandidateStage } from '../../../models';

@Component({
    selector: 'app-admin-candidate-detail',
    standalone: true,
    imports: [CommonModule, RecruitmentPipelineVisualComponent],
    template: `
    <div class="space-y-6">
       <!-- Header / Back Button -->
       <div class="flex items-center space-x-4">
           <button (click)="goBack()" class="p-2 rounded-full hover:bg-slate-200 text-slate-500">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           </button>
           <h1 class="text-2xl font-bold text-gray-900">Candidate Profile</h1>
       </div>

       @if (candidate(); as c) {
           <div class="bg-white shadow rounded-lg overflow-hidden">
               <!-- Pipeline Visual -->
               <div class="p-8 border-b border-gray-100">
                   <h2 class="text-lg font-medium text-gray-900 text-center mb-8">Recruitment Pipeline</h2>
                   <app-recruitment-pipeline-visual [stage]="c.stage"></app-recruitment-pipeline-visual>
               </div>

               <!-- Details Grid -->
               <div class="p-8">
                   <div class="flex items-start justify-between">
                       <div class="flex items-center space-x-6">
                           <img [src]="c.avatar" class="w-24 h-24 rounded-full border-4 border-gray-50">
                           <div>
                               <h2 class="text-3xl font-bold text-gray-900">{{ c.name }}</h2>
                               <p class="text-lg text-gray-500">{{ c.experience }} years exp</p>
                               <div class="flex gap-2 mt-2">
                                   @for (skill of c.skills; track skill) {
                                       <span class="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm">{{ skill }}</span>
                                   }
                               </div>
                           </div>
                       </div>
                       
                       <div class="text-right">
                           <p class="text-sm text-gray-500">Applied on</p>
                           <p class="text-lg font-medium text-gray-900">{{ c.appliedDate }}</p>
                           <div class="mt-4">
                               <span class="text-4xl font-bold text-yellow-500">{{ c.rating }}</span>
                               <span class="text-gray-400">/5</span>
                           </div>
                       </div>
                   </div>

                   <!-- Actions -->
                   <div class="mt-8 pt-8 border-t border-gray-100 flex justify-end space-x-4">
                       <a [href]="c.resumeUrl" target="_blank" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download CV
                       </a>
                        <button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Schedule Interview</button>
                        
                        <!-- Stage Actions -->
                        @if (c.stage === 'Applied') {
                             <button (click)="updateStage('Screening')" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Move to Screening</button>
                        }
                        @if (c.stage === 'Screening') {
                             <button (click)="updateStage('Interview')" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Move to Interview</button>
                        }
                        @if (c.stage === 'Interview') {
                             <button (click)="updateStage('Offer')" class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Extend Offer</button>
                        }
                        @if (c.stage === 'Offer') {
                             <button (click)="updateStage('Hired')" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Mark as Hired</button>
                        }
                   </div>
               </div>
           </div>
       } @else {
           <div class="text-center py-12">
               Loading candidate...
           </div>
       }
    </div>
  `
})
export class AdminCandidateDetailComponent implements OnInit {
    route = inject(ActivatedRoute);
    router = inject(Router);
    dataService = inject(DataService);

    candidateId = signal<number | null>(null);

    candidate = computed(() => {
        const id = this.candidateId();
        if (!id) return null;
        return this.dataService.candidates().find(c => c.id === id) || null;
    });

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.candidateId.set(Number(id));
            }
        });
    }

    goBack() {
        this.router.navigate(['/admin/pipeline']);
    }

    updateStage(stage: CandidateStage) {
        const id = this.candidateId();
        if (id) {
            this.dataService.updateCandidateStage(id, stage);
        }
    }
}
