import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { RouterLink } from '@angular/router';
import { CandidateStage } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  dataService = inject(DataService);

  // For stats cards
  activeJobs = computed(() => this.dataService.jobs().filter(j => j.status === 'Published').length);
  totalCandidates = computed(() => this.dataService.candidates().length);
  pendingOnboarding = computed(() => this.dataService.onboardingProcesses().length);
  openGigs = computed(() => this.dataService.gigs().filter(g => g.status === 'Open').length);

  // For "Recent Candidates" list
  recentCandidates = computed(() => this.dataService.candidates().slice(-5).reverse());

  // For "Pipeline Summary"
  pipelineSummary = computed(() => {
    const stages: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
    const candidates = this.dataService.candidates();
    return stages.map(stage => ({
      stage,
      count: candidates.filter(c => c.stage === stage).length
    }));
  });

  // For "Active Job Postings" table
  activeJobPostings = computed(() => this.dataService.jobs().filter(j => j.status === 'Published'));
}
