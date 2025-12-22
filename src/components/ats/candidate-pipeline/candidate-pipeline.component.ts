import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { Candidate, CandidateStage, Job } from '../../../models';

@Component({
  selector: 'app-candidate-pipeline',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './candidate-pipeline.component.html',
  styleUrls: ['./candidate-pipeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidatePipelineComponent implements OnInit {
  dataService = inject(DataService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  viewMode = signal<'list' | 'detail'>('list');
  selectedCandidate = signal<Candidate | null>(null);

  stages: CandidateStage[] = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer', 'Hired'];
  stageColors: Record<CandidateStage, string> = {
    Applied: 'bg-blue-500',
    Screening: 'bg-purple-500',
    Shortlisted: 'bg-pink-500',
    Interview: 'bg-orange-500',
    Offer: 'bg-teal-500',
    Hired: 'bg-green-500',
    Rejected: 'bg-red-500',
  };

  searchTerm = signal('');
  selectedJobId = signal<number | 'all'>('all');

  // Modals and notifications
  showSendEmailModal = signal(false);
  showScheduleInterviewModal = signal(false);
  toast = signal<{ message: string; details: string } | null>(null);
  newNote = signal('');
  activeTab = signal<'notes' | 'interviews' | 'communications'>('notes');

  allJobs = computed(() => this.dataService.jobs());

  selectedJob = computed(() => {
    const candidate = this.selectedCandidate();
    if (!candidate) return null;
    return this.dataService.jobs().find(j => j.id === candidate.jobId);
  });

  filteredCandidates = computed(() => {
    const jobId = this.selectedJobId();
    const term = this.searchTerm().toLowerCase();
    const allCandidates = this.dataService.candidates();

    const candidatesForJob = jobId !== 'all'
      ? allCandidates.filter(c => c.jobId === jobId)
      : allCandidates;

    if (!term) return candidatesForJob;

    return candidatesForJob.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.skills.some(s => s.toLowerCase().includes(term))
    );
  });

  candidatesByStage = computed(() => {
    const candidates = this.filteredCandidates();
    const stageMap = this.stages.reduce((acc, stage) => {
      acc[stage] = [];
      return acc;
    }, {} as Record<CandidateStage, Candidate[]>);

    for (const candidate of candidates) {
      if (stageMap[candidate.stage]) {
        stageMap[candidate.stage].push(candidate);
      }
    }

    return stageMap;
  });

  // For detail view
  applicationTimeline = computed(() => {
    const allStages: CandidateStage[] = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer', 'Hired'];
    const currentStage = this.selectedCandidate()?.stage;
    if (!currentStage) return [];
    const currentIndex = allStages.indexOf(currentStage);

    return allStages.map((stage, index) => ({
      name: stage,
      status: index < currentIndex ? 'completed' : (index === currentIndex ? 'current' : 'pending')
    }));
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const candidateId = params['candidate'];
      const jobId = params['jobId'];
      if (jobId) this.selectedJobId.set(+jobId);

      if (candidateId) {
        this.selectCandidate(+candidateId);
      } else {
        this.goBackToList();
      }
    });
  }

  selectCandidate(candidateId: number) {
    this.router.navigate(['/admin/candidate', candidateId]);
  }

  goBackToList() {
    this.viewMode.set('list');
    this.selectedCandidate.set(null);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { candidate: null },
      queryParamsHandling: 'merge'
    });
  }

  addNote() {
    const candidate = this.selectedCandidate();
    const noteText = this.newNote().trim();
    if (candidate && noteText) {
      this.dataService.addCandidateNote(candidate.id, noteText);
      this.newNote.set('');
      // a little hacky to refresh the view
      this.selectCandidate(candidate.id);
    }
  }

  moveStage() {
    const candidate = this.selectedCandidate();
    if (!candidate) return;

    const currentIndex = this.stages.indexOf(candidate.stage);
    if (currentIndex < this.stages.length - 1) {
      const nextStage = this.stages[currentIndex + 1];
      this.dataService.updateCandidateStage(candidate.id, nextStage);
      this.selectCandidate(candidate.id); // Refresh data
      this.showToast('Stage updated', `${candidate.name} has been moved to ${nextStage}.`);
    }
  }

  showToast(message: string, details: string) {
    this.toast.set({ message, details });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
