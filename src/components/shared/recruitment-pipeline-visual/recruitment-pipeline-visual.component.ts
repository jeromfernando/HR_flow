import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateStage } from '../../../models';

@Component({
  selector: 'app-recruitment-pipeline-visual',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'border border-slate-200 rounded-lg ' + (size() === 'large' ? 'p-6 bg-slate-50/50' : 'p-3 bg-slate-50')">
      @if (size() === 'large') {
        <h3 class="text-center text-base font-semibold text-gray-700 mb-8">Recruitment Pipeline</h3>
      }
      <div class="flex items-center">
        @for (stage of stages; track stage.name; let i = $index; let isLast = $last) {
          <div class="flex flex-col items-center text-center flex-shrink-0" [style.width]="isLast ? 'auto' : '100%'">
            @let status = getStageStatus(i);
            <!-- Circle and Icon -->
            <div [class]="'relative z-10 rounded-full flex items-center justify-center text-white ' + (size() === 'large' ? 'w-14 h-14' : 'w-10 h-10') + ' ' + (status === 'pending' ? 'bg-slate-300' : stage.color)">
              <!-- Icons -->
              @if (stage.name === 'Applied') {
                <svg [class]="size() === 'large' ? 'w-7 h-7' : 'w-5 h-5'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              } @else if (stage.name === 'Screening') {
                <svg [class]="size() === 'large' ? 'w-7 h-7' : 'w-5 h-5'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V17l-4 2v-7.586L4.293 6.707A1 1 0 014 6V4z"></path></svg>
              } @else if (stage.name === 'Interview') {
                <svg [class]="size() === 'large' ? 'w-7 h-7' : 'w-5 h-5'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              } @else if (stage.name === 'Offer') {
                <svg [class]="(size() === 'large' ? 'w-8 h-8' : 'w-6 h-6')" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path d="M12 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
                    <path d="M12 15l3.4 5.89l1.598 -3.233l3.598 .232l-3.4 -5.889" />
                    <path d="M6.802 12l-3.4 5.89l3.598 -.233l1.598 3.232l3.4 -5.889" />
                </svg>
              } @else if (stage.name === 'Hired') {
                <svg [class]="size() === 'large' ? 'w-7 h-7' : 'w-5 h-5'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              }
            </div>
            <!-- Label -->
            <p [class]="'mt-2 font-semibold ' + (size() === 'large' ? 'text-sm' : 'text-xs') + ' ' + (status === 'pending' ? 'text-gray-400' : 'text-gray-900')">
                {{ stage.label }}
            </p>
            <p [class]="'text-gray-400 ' + (size() === 'large' ? 'text-xs' : 'text-[10px]')">Stage {{ i + 1 }}</p>
          </div>
          
          <!-- Connector Line -->
          @if (!isLast) {
            <div [class]="'flex-auto h-1 ' + (size() === 'large' ? '-mt-12' : '-mt-8') + ' ' + (getStageStatus(i) === 'completed' ? stage.lineColor : 'bg-slate-300')"></div>
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruitmentPipelineVisualComponent {
    currentStage = input.required<CandidateStage>();
    size = input<'large' | 'small'>('large');

    stages = [
        { name: 'Applied',   label: 'Sourcing',  color: 'bg-blue-600',   lineColor: 'bg-blue-600' },
        { name: 'Screening', label: 'Screening', color: 'bg-cyan-500',   lineColor: 'bg-purple-600' },
        { name: 'Interview', label: 'Interview', color: 'bg-purple-600', lineColor: 'bg-gradient-to-r from-purple-600 to-orange-500' },
        { name: 'Offer',     label: 'Offer',     color: 'bg-orange-500', lineColor: 'bg-gradient-to-r from-orange-500 to-green-500' },
        { name: 'Hired',     label: 'Hired',     color: 'bg-green-500',  lineColor: '' },
    ];

    visualStageNames: ('Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired')[] = this.stages.map(s => s.name as any);
    
    currentIndex = computed(() => {
        let stage = this.currentStage();
        // Map 'Shortlisted' data stage to 'Interview' visual stage since it's conceptually the step before.
        if (stage === 'Shortlisted') {
            stage = 'Interview';
        }
        const index = this.visualStageNames.indexOf(stage as any);
        return index === -1 ? 0 : index;
    });

    getStageStatus(index: number): 'completed' | 'current' | 'pending' {
        const currentIdx = this.currentIndex();
        if (index < currentIdx) return 'completed';
        if (index === currentIdx) return 'current';
        return 'pending';
    }
}
