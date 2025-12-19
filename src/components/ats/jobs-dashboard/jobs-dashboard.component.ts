import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jobs-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './jobs-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsDashboardComponent {
  dataService = inject(DataService);
  
  // Signals for filtering
  searchTerm = signal('');
  selectedStatus = signal('All');
  selectedDepartment = signal('All');

  // Computed signal for unique departments
  departments = computed(() => {
    const allJobs = this.dataService.jobs();
    const uniqueDepartments = [...new Set(allJobs.map(job => job.department))];
    return ['All', ...uniqueDepartments];
  });

  // Computed signal for filtered jobs
  filteredJobs = computed(() => {
    const jobs = this.dataService.jobs();
    const term = this.searchTerm().toLowerCase();
    const status = this.selectedStatus();
    const department = this.selectedDepartment();

    return jobs.filter(job => {
        const matchesTerm = job.title.toLowerCase().includes(term) || 
                            job.skills.some(s => s.toLowerCase().includes(term));
        const matchesStatus = status === 'All' || job.status === status;
        const matchesDepartment = department === 'All' || job.department === department;
        return matchesTerm && matchesStatus && matchesDepartment;
    });
  });
}
