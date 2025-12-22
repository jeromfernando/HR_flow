import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruitment-pipeline-visual',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full py-6">
      <div class="w-full max-w-5xl mx-auto">
          <!-- Continuous Bar -->
          <div class="relative flex w-full h-14 rounded-full overflow-hidden bg-gray-100 shadow-sm">
            @for (step of steps(); track step.name; let i = $index; let isLast = $last) {
              <!-- Step Segment -->
              <div 
                  class="relative flex-1 flex items-center justify-center transition-all duration-500 ease-in-out cursor-default group"
                  [ngClass]="getSegmentClass(i)"
              >
                 <!-- Connected Arrow effect (CSS trianlge overlay if needed, or just plain blocks). 
                      User asked for continuous. Let's do simple continuous blocks first. 
                      To make it look like a chevron pipeline (classic 'breadcrumb' arrow), we'd use clips paths.
                      But the user just said 'continuous'. Let's stick to connected blocks with maybe a slight separator.
                 -->
                 
                 <!-- Label inside the bar -->
                 <div class="z-10 flex flex-col items-center">
                    <div class="flex items-center space-x-2">
                        <!-- Icon -->
                        <ng-container [ngSwitch]="step.icon">
                             <svg *ngSwitchCase="'file'" class="w-5 h-5" [class]="getTextColor(i)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                             <svg *ngSwitchCase="'filter'" class="w-5 h-5" [class]="getTextColor(i)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                             <svg *ngSwitchCase="'calendar'" class="w-5 h-5" [class]="getTextColor(i)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                             <svg *ngSwitchCase="'award'" class="w-5 h-5" [class]="getTextColor(i)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             <svg *ngSwitchCase="'check'" class="w-5 h-5" [class]="getTextColor(i)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </ng-container>
                        
                        <span class="font-bold text-sm" [class]="getTextColor(i)">{{ step.name }}</span>
                    </div>
                 </div>

                 <!-- Separator Line (except last) -->
                 @if (!isLast) {
                    <div class="absolute right-0 h-8 w-px bg-white/30"></div>
                 }
              </div>
            }
          </div>
      </div>
    </div>
  `
})
export class RecruitmentPipelineVisualComponent {

  @Input() set stage(value: string) {
    this._stage.set(value);
  }

  _stage = signal('');

  steps = signal([
    { name: 'Applied', icon: 'file' },
    { name: 'Screening', icon: 'filter' },
    { name: 'Interview', icon: 'calendar' },
    { name: 'Offer', icon: 'award' },
    { name: 'Hired', icon: 'check' }
  ]);

  currentStepIndex = computed(() => {
    const s = this._stage();
    return this.steps().findIndex(step => step.name === s);
  });

  getSegmentClass(index: number): string {
    const current = this.currentStepIndex();

    // If completed or active, show color. Else gray.
    // Actually, typically pipeline shows previous steps as completed (colored) and future as gray.
    // Or, showing the *process* flow:

    if (index <= current) {
      // It's active or passed
      switch (index) {
        case 0: return 'bg-blue-500';
        case 1: return 'bg-purple-500';
        case 2: return 'bg-orange-500';
        case 3: return 'bg-yellow-500';
        case 4: return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    } else {
      // Future steps
      return 'bg-gray-200';
    }
  }

  getTextColor(index: number): string {
    const current = this.currentStepIndex();
    return index <= current ? 'text-white' : 'text-gray-400';
  }
}
