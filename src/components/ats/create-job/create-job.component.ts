import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { Job } from '../../../models';

type NewJob = Omit<Job, 'id' | 'applicants'>;

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-job.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateJobComponent {
  dataService = inject(DataService);
  router = inject(Router);

  newJob = signal<NewJob>({
    title: '',
    department: '',
    location: '',
    salaryMin: 80000,
    salaryMax: 120000,
    currency: 'USD',
    experience: '',
    description: '',
    status: 'Draft',
    postType: 'External',
    skills: [],
  });
  
  skillsInput = signal('');

  departments = ['Engineering', 'Product', 'Design', 'Human Resources', 'Sales', 'Marketing'];
  experienceLevels = ['Entry-level', '1-2 years', '3-5 years', '5+ years', '10+ years'];
  currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  // Update methods for form fields to avoid arrow functions in templates
  updateJobField<K extends keyof NewJob>(key: K, value: NewJob[K]) {
    this.newJob.update(job => ({ ...job, [key]: value }));
  }

  updateNumericJobField(key: 'salaryMin' | 'salaryMax', value: string | number) {
    this.newJob.update(job => ({ ...job, [key]: +value }));
  }

  addSkill() {
    const skill = this.skillsInput().trim();
    if (skill && !this.newJob().skills.includes(skill)) {
      this.newJob.update(job => ({ ...job, skills: [...job.skills, skill] }));
      this.skillsInput.set('');
    }
  }

  removeSkill(skillToRemove: string) {
    this.newJob.update(job => ({
      ...job,
      skills: job.skills.filter(skill => skill !== skillToRemove)
    }));
  }
  
  saveJob(status: 'Draft' | 'Published') {
    const jobData = { ...this.newJob(), status };
    if (jobData.title && jobData.department) {
      this.dataService.addJob(jobData);
      this.router.navigate(['/jobs']);
    } else {
      // Basic validation feedback
      alert('Please fill in required fields: Job Title and Department.');
    }
  }

  cancel() {
    this.router.navigate(['/jobs']);
  }
}
